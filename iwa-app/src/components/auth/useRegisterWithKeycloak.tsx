// // TypeScript
// // File: `src/components/auth/useRegisterWithKeycloak.tsx`
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   useAuthRequest,
//   makeRedirectUri,
//   useAutoDiscovery,
//   exchangeCodeAsync,
//   ResponseType,
// } from "expo-auth-session";
// import AuthService from "./AuthService";
//
// type Tokens = { accessToken?: string | null; idToken?: string | null };
//
// export default function useRegisterWithKeycloak() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const keycloakHost = process.env.EXPO_PUBLIC_KEYCLOAK_HOST ?? "";
//   const keycloakRealm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? "";
//   const discoveryUrl = `${keycloakHost}/realms/${keycloakRealm}`;
//
//   const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? "";
//   const discovery = useAutoDiscovery(discoveryUrl);
//
//   const isWeb = typeof window !== "undefined" && !!(window as any).location;
//   const redirectUri = isWeb
//       ? (makeRedirectUri({ useProxy: true } as any) as string)
//       : makeRedirectUri({ scheme: "bonne-graine" });
//
//   const [request, response, promptAsync] = useAuthRequest(
//       {
//         clientId,
//         redirectUri,
//         scopes: ["openid", "profile", "email"],
//         responseType: ResponseType.Code,
//         usePKCE: true,
//       },
//       discovery
//   );
//
//   const pendingRef = useRef<{
//     resolve: (res: any) => void;
//     reject: (err: any) => void;
//   } | null>(null);
//
//   // When an auth response arrives, perform the PKCE exchange and call backend
//   useEffect(() => {
//     if (!response || !pendingRef.current) return;
//
//     (async () => {
//       try {
//         if (response.type !== "success") {
//           throw new Error("Auth response not successful");
//         }
//         const code = response.params?.code;
//         if (!code) throw new Error("No authorization code in response");
//
//         const codeVerifier = (request as any)?.codeVerifier;
//         if (!codeVerifier) throw new Error("Missing PKCE code verifier");
//
//         const tokenResult = await exchangeCodeAsync(
//             {
//               clientId,
//               code,
//               redirectUri,
//               extraParams: { code_verifier: codeVerifier },
//             },
//             discovery as any
//         );
//
//         const accessToken =
//             tokenResult.accessToken ?? (tokenResult as any).access_token ?? null;
//         const idToken =
//             tokenResult.idToken ?? (tokenResult as any).id_token ?? null;
//
//         const tokens: Tokens = { accessToken, idToken };
//         const backendResult = await AuthService.registerSubmitWithKeycloakTokens(tokens);
//
//         pendingRef.current?.resolve(backendResult);
//       } catch (e: any) {
//         pendingRef.current?.reject(e);
//       } finally {
//         pendingRef.current = null;
//         setLoading(false);
//         setError(null);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [response]);
//
//   const startRegister = useCallback(async (): Promise<{ ok: boolean; error?: any }> => {
//     setError(null);
//     setLoading(true);
//
//     if (!request) {
//       // If request not ready, wait similar to previous behaviour
//       return new Promise<{ ok: boolean; error?: any }>((resolve, reject) => {
//         pendingRef.current = { resolve, reject };
//         setTimeout(() => {
//           if (pendingRef.current) {
//             pendingRef.current = null;
//             setLoading(false);
//             reject({ ok: false, error: "request_timeout" });
//           }
//         }, 15000);
//       });
//     }
//
//     return new Promise<{ ok: boolean; error?: any }>((resolve, reject) => {
//       pendingRef.current = { resolve, reject };
//       // Open auth UI with Keycloak registration action so Keycloak shows the register form
//       promptAsync({ useProxy: true, extraParams: { kc_action: "register" } as any }).catch((e) => {
//         pendingRef.current = null;
//         setLoading(false);
//         setError(String(e));
//         reject({ ok: false, error: e });
//       });
//     });
//   }, [request, promptAsync, clientId, redirectUri, discovery]);
//
//   return { startRegister, loading, error };
// }