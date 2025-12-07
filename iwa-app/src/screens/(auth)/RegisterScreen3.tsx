// File: src/screens/(auth)/RegisterScreen3.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { SignupData1 } from "./RegisterScreen1";
import type { SignupData2 } from "./RegisterScreen2";
import useRegisterWithKeycloak from "../../components/auth/useRegisterWithKeycloak";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/authContext";
import * as SecureStore from "expo-secure-store";

export default function RegisterScreen3() {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1, step2 } =
  (route.params as { step1: SignupData1; step2: SignupData2 }) || {};

  const { startRegister, loading, error } = useRegisterWithKeycloak();
  const { completeSignIn } = useContext(AuthContext);
  const [attempted, setAttempted] = useState(false);
  const { t } = useTranslation();

  // Try to extract tokens from different sources:
  async function extractTokensFromResultOrStore(result: any) {
    // 1) If hook/service returned tokens directly
    if (result?.tokens && (result.tokens.accessToken || result.tokens.idToken)) {
      return {
        accessToken: result.tokens.accessToken ?? null,
        idToken: result.tokens.idToken ?? null,
      };
    }

    if (result?.accessToken || result?.idToken) {
      return {
        accessToken: result.accessToken ?? null,
        idToken: result.idToken ?? null,
      };
    }

    // 2) Try SecureStore (native)
    try {
      if (Platform.OS !== "web" && typeof SecureStore.getItemAsync === "function") {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const idToken = await SecureStore.getItemAsync("idToken");
        if (accessToken || idToken) return { accessToken, idToken };
      }
    } catch (e) {
      // ignore and fallback
    }

    // 3) Try localStorage (web)
    try {
      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        const accessToken = window.localStorage.getItem("accessToken");
        const idToken = window.localStorage.getItem("idToken");
        if (accessToken || idToken) return { accessToken, idToken };
      }
    } catch (e) {
      // ignore
    }

    return { accessToken: null, idToken: null };
  }

  async function runRegisterFlow() {
    setAttempted(true);
    try {
      const result = await startRegister(); // should return { ok: boolean, ... }
      if (!result || !result.ok) {
        Alert.alert(t("error") ?? "Erreur", `Inscription échouée: ${String(result?.error ?? "unknown")}`);
        return;
      }

      // attempt to obtain tokens (from result or storage)
      const tokens = await extractTokensFromResultOrStore(result);

      // If we have at least one token, complete sign in in context
      if (tokens.accessToken || tokens.idToken) {
        try {
          await completeSignIn({ accessToken: tokens.accessToken, idToken: tokens.idToken });
        } catch (e) {
          console.warn("completeSignIn failed:", e);
        }
      } else {
        console.warn("No tokens found after registration; continuing without automatic sign-in.");
      }

      // Navigate to Home and clear stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e: any) {
      Alert.alert(t("error") ?? "Erreur", String(e ?? "unknown"));
    }
  }

  useEffect(() => {
    if (!attempted) {
      // auto start register when screen mounts
      runRegisterFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{t("register_title") ?? "Inscription en cours"}</Text>

          <View style={{ alignItems: "center", marginTop: 24 }}>
            {loading ? (
                <>
                  <ActivityIndicator size="large" color="#111827" />
                  <Text style={{ marginTop: 12 }}>{t("please_wait") ?? "Veuillez patienter..."}</Text>
                </>
            ) : (
                <>
                  <Text style={{ marginBottom: 12 }}>{t("register_instructions") ?? "La page d'inscription s'est fermée. Appuyez pour réessayer."}</Text>
                  <Pressable onPress={runRegisterFlow} style={styles.retryBtn}>
                    <Text style={styles.retryText}>{t("retry") ?? "Réessayer"}</Text>
                  </Pressable>
                </>
            )}

            {error ? <Text style={{ color: "red", marginTop: 12 }}>{String(error)}</Text> : null}
          </View>
        </View>
      </View>
  );
}

const BG = "#B9ECFF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
});