import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type Props = {
  onLogin?: () => void;         // facultatif : callback si tu veux brancher ton auth plus tard
  onSignupClick?: () => void;   // facultatif : callback vers l’inscription
};

export default function LoginScreen({ onLogin, onSignupClick }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    // TODO: branche ton appel API / validation ici
    onLogin?.();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Notch "maquette" */}
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

          <View style={styles.passwordWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.inputWithIcon]}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              style={styles.eyeButton}
              hitSlop={10}
            >
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </Pressable>
          </View>

          <View style={styles.right}>
            <Pressable onPress={onSignupClick}>
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
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
    marginTop: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 48,
    color: "#111827",
    // utilise ta police Gaegu chargée dans App.tsx
    fontFamily: "Gaegu",
    fontWeight: "700",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 360,
    gap: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  passwordWrapper: {
    position: "relative",
  },
  inputWithIcon: {
    paddingRight: 44, // place pour l’icône œil
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -10, // moitié de la hauteur icône (20)
  },
  right: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  link: {
    color: "#111827",
    textDecorationLine: "underline",
    fontFamily: "Gaegu",
    fontWeight: "700",
    fontSize: 16,
  },
  submit: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 12,
  },
  submitText: {
    fontSize: 24,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
});
