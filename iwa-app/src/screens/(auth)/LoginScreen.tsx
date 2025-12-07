import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, StatusBar,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

const handleSubmit = () => {
  // TODO: login (optionnel)
  // Redirige et nettoie l'historique pour éviter "Back" vers Login
  navigation.reset({
    index: 0,
    routes: [{ name: "Home" }],
  });
};

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.langWrapper}>
        <Pressable onPress={() => navigation.navigate("Language")} hitSlop={10}>
          <Text style={styles.langText}>🌐</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Text style={styles.title}>{t("login_title")}</Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t("login_email")}
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <View style={{ position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t("login_password")}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 44 }]}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              style={{ position: "absolute", right: 12, top: "50%", marginTop: -10 }}
              hitSlop={10}
            >
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          </View>

          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            <Pressable onPress={() => navigation.navigate("Register1")}>
              <Text style={styles.link}>{t("login_signup_question")}</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleSubmit} style={styles.submit}>
            <Text style={styles.submitText}>{t("login_submit")}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.adminWrapper}>
        <Pressable 
          onPress={() => navigation.navigate("AdminLogin")}
          hitSlop={10}
        >
          <Text style={styles.adminText}>{t("login_admin")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const BG = "#B9ECFF";

const styles = StyleSheet.create({
  langWrapper: {
  position: "absolute",
  top: 48,
  right: 24,
  zIndex: 20,
  },

  langText: {
    fontSize: 22,
    color: "#111827",
    fontWeight: "700",
  },

  root: { flex: 1, backgroundColor: BG },
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 32, marginBottom: 48, color: "#111827", fontFamily: "Gaegu", fontWeight: "700", textAlign: "center",
  },
  form: { width: "100%", maxWidth: 360, gap: 12 },
  input: {
    backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827",
  },
  link: { color: "#111827", textDecorationLine: "underline", fontFamily: "Gaegu", fontWeight: "700", fontSize: 16 },
  submit: { marginTop: 24, alignItems: "center", paddingVertical: 12 },
  submitText: { fontSize: 24, color: "#111827", fontFamily: "Gaegu", fontWeight: "700" },
    adminWrapper: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
  },
  adminText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Gaegu",
    fontWeight: "700",
    opacity: 0.7,
  },
});
