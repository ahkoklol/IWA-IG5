import React, {
  createContext,
  useMemo,
  useReducer,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  useAuthRequest,
  makeRedirectUri,
  useAutoDiscovery,
  exchangeCodeAsync,
  ResponseType,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { getUserByKeycloakUserId } from "../api/userApi";

function decodeJwt<T = any>(token?: string | null): T | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")).
          split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      )
    );
    return json as T;
  } catch (e) {
    console.warn("Failed to decode JWT:", e);
    return null;
  }
}

type AuthState = {
  isSignedIn: boolean; // Keycloak session/tokens present
  accessToken: string | null;
  idToken: string | null;
  userInfo: any | null; // decoded id_token claims
  email?: string; // from Keycloak claims
  id_user?: string; // Keycloak subject (sub)
  clientId?: string | null; // backend client id
  hasBackendAccount?: boolean; // derived
  loadingProfile?: boolean; // fetching backend user
};

type AuthAction =
  | {
      type: "SIGN_IN";
      payload: { accessToken: string | null; idToken: string | null };
    }
  | { type: "USER_INFO"; payload: { email: string; id_user: string } }
  | { type: "BACKEND_USER"; payload: { clientId: string | null } }
  | { type: "LOADING_PROFILE"; payload: { loading: boolean } }
  | { type: "SIGN_OUT" };

type AuthContextType = {
  state: AuthState;
  signIn: () => void;
  signOut: () => void;
  completeSignIn: (tokens: {
    accessToken?: string | null;
    idToken?: string | null;
  }) => Promise<void>;
};

const initialState: AuthState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
  clientId: null,
  hasBackendAccount: false,
  loadingProfile: false,
};

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  completeSignIn: async () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        isSignedIn: true,
        accessToken: action.payload.accessToken,
        idToken: action.payload.idToken,
      };
    case "USER_INFO":
      return {
        ...state,
        email: action.payload.email,
        id_user: action.payload.id_user,
        userInfo: { email: action.payload.email, sub: action.payload.id_user },
      };
    case "BACKEND_USER":
      return {
        ...state,
        clientId: action.payload.clientId,
        hasBackendAccount: !!action.payload.clientId,
      };
    case "LOADING_PROFILE":
      return { ...state, loadingProfile: action.payload.loading };
    case "SIGN_OUT":
      return initialState;
    default:
      return state;
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const [pendingSignIn, setPendingSignIn] = useState(false);

  const keycloakHost = process.env.EXPO_PUBLIC_KEYCLOAK_HOST ?? "";
  const keycloakRealm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? "";
  const keycloakDiscoveryUrl = `${keycloakHost}/realms/${keycloakRealm}`;

  const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "";
  if (!keycloakDiscoveryUrl || !clientId) {
    throw new Error("Missing Keycloak config in environment variables");
  }

  const discovery = useAutoDiscovery(keycloakDiscoveryUrl);

  const isWeb = typeof window !== "undefined" && !!(window as any).location;
  if (isWeb) WebBrowser.maybeCompleteAuthSession();

  const secureStoreAvailable =
    !isWeb &&
    typeof (SecureStore as any).setItemAsync === "function" &&
    typeof (SecureStore as any).deleteItemAsync === "function";

  const saveToken = async (key: string, value: string | null) => {
    if (!value) return;
    if (secureStoreAvailable) {
      try {
        await SecureStore.setItemAsync(key, value);
        return;
      } catch (err) {
        console.warn("SecureStore.setItemAsync failed, falling back:", err);
      }
    }
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("Fallback saveToken (localStorage) failed:", e);
    }
  };

  const deleteToken = async (key: string) => {
    if (secureStoreAvailable) {
      try {
        await SecureStore.deleteItemAsync(key);
        return;
      } catch (err) {
        console.warn("SecureStore.deleteItemAsync failed, falling back:", err);
      }
    }
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("Fallback deleteToken (localStorage) failed:", e);
    }
  };

  const redirectUri = isWeb
    ? (makeRedirectUri({ useProxy: true } as any) as string)
    : makeRedirectUri({ scheme: "bonne-graine" });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  const signIn = useCallback(() => {
    if (request && typeof promptAsync === "function") {
      promptAsync().catch((e) => console.warn(e));
    } else {
      setPendingSignIn(true);
    }
  }, [request, promptAsync]);

  const signOut = useCallback(async () => {
    try {
      const idToken = authState.idToken;
      const logoutEndpoint = `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(
        idToken ?? ""
      )}`;
      if (isWeb) {
        if (logoutEndpoint) {
          try {
            await fetch(logoutEndpoint, { method: "GET" });
          } catch (e) {
            console.warn("Web logout fetch failed:", e);
          }
        }
      } else {
        try {
          await WebBrowser.openBrowserAsync(logoutEndpoint);
        } catch (e) {
          console.warn("Opening system browser for logout failed:", e);
        }
      }
      await deleteToken("accessToken");
      await deleteToken("idToken");
      await deleteToken("refreshToken");
      dispatch({ type: "SIGN_OUT" });
    } catch (e) {
      console.warn("signOut failed:", e);
    }
  }, [authState.idToken, dispatch, keycloakHost, keycloakRealm, isWeb]);

  const completeSignIn = useCallback(
    async (tokens: { accessToken?: string | null; idToken?: string | null }) => {
      try {
        const { accessToken, idToken } = tokens;
        if (accessToken) await saveToken("accessToken", accessToken);
        if (idToken) await saveToken("idToken", idToken);
        dispatch({ type: "SIGN_IN", payload: { accessToken: accessToken ?? null, idToken: idToken ?? null } });
      } catch (e) {
        console.warn("completeSignIn failed:", e);
      }
    },
    []
  );

  // After we have idToken, decode claims and fetch backend user
  useEffect(() => {
    async function fetchBackendUser(idTokenLocal: string | null) {
      if (!idTokenLocal) return;
      const claims = decodeJwt<{ sub?: string; email?: string }>(idTokenLocal);
      const sub = claims?.sub ?? null;
      const email = claims?.email ?? "";
      console.log("Decoded idToken claims:", claims);

      if (sub) {
        console.log("Fetching backend user for Keycloak user ID:", sub);
        dispatch({ type: "USER_INFO", payload: { email, id_user: sub } });
        dispatch({ type: "LOADING_PROFILE", payload: { loading: true } });
        try {

          const user = await getUserByKeycloakUserId(sub, idTokenLocal);
          console.log("user fetched from backend:", user);
          const clientId = (user as any)?.clientId ?? null;
          dispatch({ type: "BACKEND_USER", payload: { clientId } });
        } catch (e: any) {
          // If 404, mark as no backend account
          const status = e?.response?.status ?? 0;
          if (status === 404) {
            dispatch({ type: "BACKEND_USER", payload: { clientId: null } });
          } else {
            console.warn("Failed to fetch backend user:", e);
            dispatch({ type: "BACKEND_USER", payload: { clientId: null } });
          }
        } finally {
          dispatch({ type: "LOADING_PROFILE", payload: { loading: false } });
        }
      }
    }

    fetchBackendUser(authState.idToken);
  }, [authState.idToken]);

  // Handle auth response
  useEffect(() => {
    async function handleResponse() {
      if (!response) return;
      if (response.type !== "success") {
        if (response.type === "error") console.warn("Auth response error", response);
        return;
      }
      const code = response.params?.code;
      if (!code) {
        console.warn("No authorization code returned in response:", response);
        return;
      }
      const codeVerifier = (request as any)?.codeVerifier;
      if (!codeVerifier) {
        console.warn("Missing code verifier on request — cannot exchange code for tokens");
        return;
      }
      try {
        const tokenResult = await exchangeCodeAsync(
          { clientId, code, redirectUri, extraParams: { code_verifier: codeVerifier } },
          discovery as any
        );
        const accessToken = tokenResult.accessToken ?? (tokenResult as any).access_token ?? null;
        const idToken = tokenResult.idToken ?? (tokenResult as any).id_token ?? null;
        const refreshToken = tokenResult.refreshToken ?? (tokenResult as any).refresh_token ?? null;
        if (accessToken) await saveToken("accessToken", accessToken);
        if (idToken) await saveToken("idToken", idToken);
        if (refreshToken) await saveToken("refreshToken", refreshToken);
        dispatch({ type: "SIGN_IN", payload: { accessToken, idToken } });
      } catch (e) {
        console.warn("Failed to exchange code for tokens:", e);
      }
    }
    handleResponse();
  }, [response, request, clientId, redirectUri, discovery]);

  const authContext = useMemo(
    () => ({ state: authState, signIn, signOut, completeSignIn }),
    [authState, signIn, signOut, completeSignIn]
  );

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};



export { AuthContext, AuthProvider };
