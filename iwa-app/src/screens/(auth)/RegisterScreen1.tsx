import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import AuthService from "../../components/auth/AuthService";

export interface SignupData1 {
  lastName: string;
  firstName: string;
  birthDate: string; // format JJ/MM/AAAA
  email: string;
  phone: string;
  username: string;
}

export default function RegisterScreen1() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [jj, setJj] = useState("");
  const [mm, setMm] = useState("");
  const [aaaa, setAaaa] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");

  const handleNext = () => {
    console.log("RegisterScreen1 - handleNext");
    const birthDate = `${jj.padStart(2, "0")}/${mm.padStart(2, "0")}/${aaaa}`;
    // We still collect the email on the form, but we won't rely on it.
    // Keycloak will provide the authoritative email at registration time.
    const step1: SignupData1 = {
      lastName,
      firstName,
      birthDate,
      email,
      phone,
      username,
    };

    // Save step1 for later; but clear the email to avoid using the client-provided email as authoritative
    const step1ToSave: SignupData1 = { ...step1, email: "" };
    AuthService.setRegisterStep1(step1ToSave);

    // navigate and pass the step for display if needed (we pass the saved version)
    navigation.navigate("Register2", { step1: step1ToSave });
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
        <Text style={styles.title}>Inscription</Text>

        <View style={{ gap: 12 }}>
          <View>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Date de naissance</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TextInput
                value={jj}
                onChangeText={setJj}
                placeholder="JJ"
                maxLength={2}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  styles.dateInput,
                  { textAlign: "center" },
                ]}
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                value={mm}
                onChangeText={setMm}
                placeholder="MM"
                maxLength={2}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  styles.dateInput,
                  { textAlign: "center" },
                ]}
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                value={aaaa}
                onChangeText={setAaaa}
                placeholder="AAAA"
                maxLength={4}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  styles.yearInput,
                  { textAlign: "center" },
                ]}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>
          <View style={styles.footer}>
            <Pressable onPress={handleNext}>
              <Text style={styles.next}>Suivant</Text>
            </Pressable>
          </View>

          <View>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>Pseudonyme</Text>
            <View style={{ position: "relative" }}>
              <Text style={styles.at}>@</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={[styles.input, { paddingLeft: 28 }]}
              />
            </View>
          </View>
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
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  title: {
    fontSize: 28,
    marginTop: 8,
    marginBottom: 16,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
  label: { fontSize: 14, color: "#111827", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
  },
  dateInput: { width: 64 },
  yearInput: { width: 88 },
  slash: { marginHorizontal: 4, color: "#111827" },
  at: {
    position: "absolute",
    left: 10,
    top: "50%",
    marginTop: -10,
    color: "#111827",
    fontSize: 16,
  },
  footer: { paddingVertical: 16, alignItems: "flex-end" },
  next: {
    fontSize: 22,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
});
