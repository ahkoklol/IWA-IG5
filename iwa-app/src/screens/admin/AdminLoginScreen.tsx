//src/screens/admin/AdminLoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { ArrowLeft, Eye } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AdminLogin">;

export function AdminLoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        navigation.navigate("AdminRoot");
    };



  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#668b01", "#d3ee48"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView>
          <View style={styles.backRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <ArrowLeft size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Content centré */}
        <KeyboardAvoidingView
          style={styles.contentWrapper}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={styles.contentInner}>
            <Text style={styles.title}>Administration</Text>

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
                  autoCapitalize="none"
                  style={[styles.input, { paddingRight: 44 }]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.eyeButton}
                  hitSlop={10}
                >
                  <Eye size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitText}>Se connecter (Admin)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
  },
  contentInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    marginBottom: 48,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
  form: {
    width: "100%",
    maxWidth: 360,
    gap: 12,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -10,
  },
  submit: {
    marginTop: 24,
    backgroundColor: "#668b01",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: {
    fontSize: 22,
    color: "#ffffff",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
});
