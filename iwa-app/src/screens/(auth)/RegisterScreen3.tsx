import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { SignupData1 } from "./RegisterScreen1";
import type { SignupData2 } from "./RegisterScreen2";
import useRegisterWithKeycloak from "../../components/auth/useRegisterWithKeycloak";

export default function RegisterScreen3() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1, step2 } =
    (route.params as { step1: SignupData1; step2: SignupData2 }) || {};

  const { startRegister, loading } = useRegisterWithKeycloak();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    // Trigger Keycloak registration flow as soon as the screen mounts
    if (!attempted) {
      setAttempted(true);
      (async () => {
        const result = await startRegister();
        if (!result || !result.ok) {
          Alert.alert(
            "Erreur",
            `Inscription échouée: ${String(result?.error ?? "unknown")}`
          );
          // keep on screen so user can retry or go back
        } else {
          // success -> navigate to Home and clear the stack
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }
      })();
    }
  }, [attempted, startRegister, navigation]);

  const handleRetry = async () => {
    setAttempted(true);
    const result = await startRegister();
    if (!result || !result.ok) {
      Alert.alert(
        "Erreur",
        `Inscription échouée: ${String(result?.error ?? "unknown")}`
      );
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.notch} />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={{ gap: 14, alignItems: "center" }}>
          <Text style={styles.label}>Redirection vers Keycloak...</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#111827" />
          ) : (
            <Text style={{ color: "#111827" }}>
              Si rien ne se passe, appuyez sur Réessayer.
            </Text>
          )}

          <Pressable onPress={handleRetry} style={styles.validateBtn}>
            <Text style={styles.validateText}>Réessayer</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color: "#111827" }}>Retour</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const BG = "#B9ECFF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
    marginTop: 8,
  },
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
    justifyContent: "center",
  },
  label: { fontSize: 16, color: "#111827", marginBottom: 6 },
  validateBtn: { marginTop: 24, alignItems: "center", paddingVertical: 12 },
  validateText: {
    fontSize: 20,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
  backBtn: { marginTop: 12 },
});
