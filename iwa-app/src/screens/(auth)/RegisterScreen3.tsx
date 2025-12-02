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
import { useTranslation } from "react-i18next";

export default function RegisterScreen3() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1, step2 } =
    (route.params as { step1: SignupData1; step2: SignupData2 }) || {};

  const { startRegister, loading } = useRegisterWithKeycloak();
  const [attempted, setAttempted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

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
      

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={{ gap: 14 }}>
          <View>
            <Text style={styles.label}>{t("register_password")}</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>{t("register_confirm_password")}</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
          </View>

          <Pressable onPress={handleComplete} style={styles.validateBtn}>
            <Text style={styles.validateText}>{t("login_submit")}</Text>
          </Pressable>
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
