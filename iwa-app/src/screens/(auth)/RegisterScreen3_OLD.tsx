import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, StatusBar, Alert } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { SignupData1 } from "./RegisterScreen1";
import type { SignupData2 } from "./RegisterScreen2";

export default function RegisterScreen3_OLD() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1, step2 } = (route.params as { step1: SignupData1; step2: SignupData2 }) || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleComplete = () => {
  if (!password || password !== confirmPassword) {
    Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
    return;
  }

  // TODO: Appel API d'inscription avec { ...step1, ...step2, password }

  // Redirige vers Home et nettoie l'historique d'inscription
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
        <View style={{ gap: 14 }}>
          <View>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
          </View>

          <Pressable onPress={handleComplete} style={styles.validateBtn}>
            <Text style={styles.validateText}>Valider</Text>
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
    width: 128, height: 32, backgroundColor: "#000",
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    alignSelf: "center", marginTop: 8,
  },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  label: { fontSize: 14, color: "#111827", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: "#111827" },
  validateBtn: { marginTop: 24, alignItems: "center", paddingVertical: 12 },
  validateText: { fontSize: 24, color: "#111827", fontFamily: "Gaegu", fontWeight: "700" },
});
