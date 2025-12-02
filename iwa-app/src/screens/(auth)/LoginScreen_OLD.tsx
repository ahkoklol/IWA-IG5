import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, StatusBar,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      <View style={styles.notch} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Text style={styles.title}>Connexion</Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Adresse e-mail"
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
              placeholder="Mot de passe"
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
              <Text style={styles.link}>S'inscrire ?</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleSubmit} style={styles.submit}>
            <Text style={styles.submitText}>Valider</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const BG = "#B9ECFF";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  notch: {
    width: 128, height: 32, backgroundColor: "#000",
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    alignSelf: "center", marginTop: 8,
  },
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
});
