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

type AuthState = {
  isSignedIn: boolean;
  accessToken: string | null;
  idToken: string | null;
  userInfo: any | null;
  email?: string;
  id_user?: string;
};

type AuthAction =
  | {
      type: "SIGN_IN";
      payload: { accessToken: string | null; idToken: string | null };
    }
  | { type: "USER_INFO"; payload: { email: string; id_user: string } }
  | { type: "SIGN_OUT" };

type AuthContextType = {
  state: AuthState;
  signIn: () => void;
  signOut: () => void;
  // New: allow flows (like registration) to finish by passing tokens into the context
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
      };
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

  // pending sign-in flag when request isn't ready yet
  const [pendingSignIn, setPendingSignIn] = useState(false);

  const keycloakHost = process.env.EXPO_PUBLIC_KEYCLOAK_HOST ?? "";
  const keycloakRealm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? "";
  const keycloakDiscoveryUrl = `${keycloakHost}/realms/${keycloakRealm}`;

  const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "";
  if (!keycloakDiscoveryUrl || !clientId) {
    throw new Error("Missing Keycloak config in environment variables");
  }

  const discovery = useAutoDiscovery(keycloakDiscoveryUrl);

  const isWeb = typeof window !== "undefined" && !!window.location;

  // let expo-web-browser try to finish any pending web auth session
  if (isWeb) WebBrowser.maybeCompleteAuthSession();

  // Fallback helpers: use SecureStore on native, localStorage on web or when SecureStore isn't available.
  const secureStoreAvailable =
    !isWeb &&
    typeof (SecureStore as any).setItemAsync === "function" &&
    typeof (SecureStore as any).deleteItemAsync === "function";

  const saveToken = async (key: string, value: string | null) => {
    if (!value) return;
    // Prefer SecureStore on native devices
    if (secureStoreAvailable) {
      try {
        await SecureStore.setItemAsync(key, value);
        return;
      } catch (err) {
        console.warn("SecureStore.setItemAsync failed, falling back:", err);
        // continue to fallback
      }
    }

    // Fallback for web (or if SecureStore failed)
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("Fallback saveToken (localStorage) failed:", e);
    }
  };

  const deleteToken = async (key: string) => {
    // Prefer SecureStore on native devices
    if (secureStoreAvailable) {
      try {
        await SecureStore.deleteItemAsync(key);
        return;
      } catch (err) {
        console.warn("SecureStore.deleteItemAsync failed, falling back:", err);
        // continue to fallback
      }
    }

    // Fallback for web (or if SecureStore failed)
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("Fallback deleteToken (localStorage) failed:", e);
    }
  };

  // use proxy on web to avoid CORS in token exchange
  // cast the options to `any` because some @types may not include `useProxy`
  // (safe: runtime accepts the option; this only silences the TypeScript error)
  const redirectUri = isWeb
    ? (makeRedirectUri({ useProxy: true } as any) as string)
    : makeRedirectUri({ scheme: "bonne-graine" });

  if (isWeb) console.log("Using web redirectUri (proxy):", redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile"],
      responseType: ResponseType.Code, // request authorization code
      usePKCE: true, // generate code_verifier/code_challenge
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

      // Construct the Keycloak logout endpoint using configured host + realm
      const logoutEndpoint = `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/logout?id_token_hint=${encodeURIComponent(
        idToken ?? ""
      )}`;

      // On native, opening the logout URL in the system browser helps clear Keycloak cookies/sessions.
      // On web, a simple GET request is sufficient (and avoids opening a new tab).
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
          // openBrowserAsync is best-effort: it opens the system browser so cookies are cleared there.
          // We don't await user returning to the app to clear local tokens/state.
          await WebBrowser.openBrowserAsync(logoutEndpoint);
        } catch (e) {
          console.warn("Opening system browser for logout failed:", e);
        }
      }

      // Clear stored tokens (SecureStore or fallback)
      await deleteToken("accessToken");
      await deleteToken("idToken");
      await deleteToken("refreshToken");

      // Update app state
      dispatch({ type: "SIGN_OUT" });
      console.log("Signed out: local tokens cleared and state reset.");
    } catch (e) {
      console.warn("signOut failed:", e);
    }
  }, [authState.idToken, dispatch, keycloakHost, keycloakRealm, isWeb]);

  // New: allow external flows (eg registration) to complete sign-in by passing tokens here
  const completeSignIn = useCallback(
    async (tokens: {
      accessToken?: string | null;
      idToken?: string | null;
    }) => {
      try {
        const { accessToken, idToken } = tokens;
        if (accessToken) await saveToken("accessToken", accessToken);
        if (idToken) await saveToken("idToken", idToken);

        // You could also save refresh token if you obtain it.
        dispatch({
          type: "SIGN_IN",
          payload: {
            accessToken: accessToken ?? null,
            idToken: idToken ?? null,
          },
        });
        console.log("Complete sign-in: tokens saved and state updated.");
      } catch (e) {
        console.warn("completeSignIn failed:", e);
      }
    },
    []
  );

  // If signIn() was called before request was ready, trigger promptAsync when ready.
  useEffect(() => {
    async function handleResponse() {
      if (!response) return;
      if (response.type !== "success") {
        if (response.type === "error")
          console.warn("Auth response error", response);
        return;
      }

      const code = response.params?.code;
      if (!code) {
        console.warn("No authorization code returned in response:", response);
        return;
      }

      // request must contain the codeVerifier generated by useAuthRequest when usePKCE:true
      const codeVerifier = (request as any)?.codeVerifier;
      if (!codeVerifier) {
        console.warn(
          "Missing code verifier on request — cannot exchange code for tokens"
        );
        return;
      }

      try {
        console.log("Exchanging code for tokens...");
        const tokenResult = await exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri,
            extraParams: { code_verifier: codeVerifier },
          },
          discovery as any // exchangeCodeAsync expects a discovery-like object
        );

        const accessToken =
          tokenResult.accessToken ?? (tokenResult as any).access_token ?? null;
        const idToken =
          tokenResult.idToken ?? (tokenResult as any).id_token ?? null;
        const refreshToken =
          tokenResult.refreshToken ??
          (tokenResult as any).refresh_token ??
          null;

        // Store tokens securely (use fallback on web)
        if (accessToken) await saveToken("accessToken", accessToken);
        if (idToken) await saveToken("idToken", idToken);
        if (refreshToken) await saveToken("refreshToken", refreshToken);

        // Update context so app reacts (navigator should switch stacks based on authState.isSignedIn)
        dispatch({ type: "SIGN_IN", payload: { accessToken, idToken } });
        console.log("Sign-in complete, tokens stored and state updated.");
      } catch (e) {
        console.warn("Failed to exchange code for tokens:", e);
      }
    }

    handleResponse();
  }, [response, request, clientId, redirectUri, discovery]);

  const authContext = useMemo(
    () => ({
      state: authState,
      signIn,
      signOut,
      completeSignIn,
    }),
    [authState, signIn, signOut, completeSignIn]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
