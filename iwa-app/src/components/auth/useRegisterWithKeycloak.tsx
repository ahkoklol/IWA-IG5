import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAuthRequest,
  makeRedirectUri,
  useAutoDiscovery,
  exchangeCodeAsync,
  ResponseType,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AuthService from "./AuthService";
import * as Linking from "expo-linking";
import * as AuthSession from "expo-auth-session";

type Tokens = { accessToken?: string | null; idToken?: string | null };

export default function useRegisterWithKeycloak() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keycloakHost = process.env.EXPO_PUBLIC_KEYCLOAK_HOST ?? "";
  const keycloakRealm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? "";
  const discoveryUrl = `${keycloakHost}/realms/${keycloakRealm}`;

  const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "";
  const discovery = useAutoDiscovery(discoveryUrl);

  const isWeb = typeof window !== "undefined" && !!(window as any).location;
  const redirectUri = isWeb
    ? (makeRedirectUri({ useProxy: true } as any) as string)
    : makeRedirectUri({ scheme: "bonne-graine" });

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  const pendingRef = useRef<{
    resolve: (res: any) => void;
    reject: (err: any) => void;
  } | null>(null);

  // Helper: open registration page manually and handle redirect with code

  const doRegisterFlow = useCallback(async (): Promise<{
    ok: boolean;
    error?: any;
  }> => {
    setError(null);
    setLoading(true);

    try {
      const regUrl = `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/registrations?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${encodeURIComponent(
        "openid profile email"
      )}`;

      // Create a promise that resolves when the app receives the redirect
      const codePromise = new Promise<string>((resolve, reject) => {
        const subscription = Linking.addEventListener("url", (event) => {
          const url = event.url;
          const parsedUrl = Linking.parse(url);
          if (parsedUrl.queryParams?.code) {
            resolve(parsedUrl.queryParams.code as string);
            subscription.remove();
          } else {
            reject("No code in redirect URL");
            subscription.remove();
          }
        });
      });

      // Open registration in browser
      await WebBrowser.openBrowserAsync(regUrl);

      // Wait for redirect code
      const code = await codePromise;

      const codeVerifier = (request as any)?.codeVerifier;
      if (!codeVerifier) throw new Error("Missing PKCE code verifier");

      // Exchange code for tokens
      const tokenResult = await exchangeCodeAsync(
        {
          clientId,
          code,
          redirectUri,
          extraParams: { code_verifier: codeVerifier },
        },
        discovery as any
      );

      const accessToken =
        tokenResult.accessToken ?? (tokenResult as any).access_token ?? null;
      const idToken =
        tokenResult.idToken ?? (tokenResult as any).id_token ?? null;

      const tokens: Tokens = { accessToken, idToken };
      const backendResult = await AuthService.registerSubmitWithKeycloakTokens(
        tokens
      );

      setLoading(false);
      return backendResult;
    } catch (e: any) {
      setError(String(e));
      setLoading(false);
      return { ok: false, error: e };
    }
  }, [request, clientId, redirectUri, discovery, keycloakHost, keycloakRealm]);

  useEffect(() => {
    if (request && pendingRef.current) {
      const { resolve, reject } = pendingRef.current;
      doRegisterFlow()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          pendingRef.current = null;
        });
    }
  }, [request, doRegisterFlow]);

  const startRegister = useCallback(async () => {
    if (request) return doRegisterFlow();

    return new Promise<{ ok: boolean; error?: any }>((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      setTimeout(() => {
        if (pendingRef.current) {
          pendingRef.current = null;
          reject({ ok: false, error: "request_timeout" });
        }
      }, 15000);
    });
  }, [request, doRegisterFlow]);

  return { startRegister, loading, error };
}
