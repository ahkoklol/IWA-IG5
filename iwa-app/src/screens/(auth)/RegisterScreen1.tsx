import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useTranslation } from "react-i18next";

export interface SignupData1 {
  lastName: string;
  firstName: string;
  birthDate: string; // format JJ/MM/AAAA
  email: string;
  phone: string;
  username: string;
}

export default function RegisterScreen1() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [jj, setJj] = useState("");
  const [mm, setMm] = useState("");
  const [aaaa, setAaaa] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const { t } = useTranslation();

  const handleNext = () => {
    const birthDate = `${jj.padStart(2, "0")}/${mm.padStart(2, "0")}/${aaaa}`;
    const step1: SignupData1 = { lastName, firstName, birthDate, email, phone, username };
    navigation.navigate("Register2", { step1 });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      

    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
        <ArrowLeft size={24} color="#111827" />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Language")}
        style={styles.langBtn}
        hitSlop={10}
      >
        <Text style={styles.langTxt}>🌐</Text>
      </Pressable>
    </View>


      <View style={styles.body}>
        <Text style={styles.title}>{t("register_title")}</Text>

        <View style={{ gap: 12 }}>
          <View>
            <Text style={styles.label}>{t("register_last_name")}</Text>
            <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>{t("register_last_name")}</Text>
            <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>{t("register_birthdate")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TextInput
                value={jj}
                onChangeText={setJj}
                placeholder="JJ"
                maxLength={2}
                keyboardType="number-pad"
                style={[styles.input, styles.dateInput, { textAlign: "center" }]}
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                value={mm}
                onChangeText={setMm}
                placeholder="MM"
                maxLength={2}
                keyboardType="number-pad"
                style={[styles.input, styles.dateInput, { textAlign: "center" }]}
              />
              <Text style={styles.slash}>/</Text>
              <TextInput
                value={aaaa}
                onChangeText={setAaaa}
                placeholder="AAAA"
                maxLength={4}
                keyboardType="number-pad"
                style={[styles.input, styles.yearInput, { textAlign: "center" }]}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>{t("register_email")}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>{t("register_phone")}</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.label}>{t("register_username")}</Text>
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

        <View style={styles.footer}>
          <Pressable onPress={handleNext}>
            <Text style={styles.next}>{t("register_next")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const BG = "#B9ECFF";

const styles = StyleSheet.create({
  langBtn: {
  position: "absolute",
  right: 16,
  top: 12,
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  },

  langTxt: {
    fontSize: 22,
    color: "#111827",
    fontWeight: "700",
  },
  root: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  title: { fontSize: 28, marginTop: 8, marginBottom: 16, color: "#111827", fontFamily: "Gaegu", fontWeight: "700" },
  label: { fontSize: 14, color: "#111827", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: "#111827" },
  dateInput: { width: 64 },
  yearInput: { width: 88 },
  slash: { marginHorizontal: 4, color: "#111827" },
  at: { position: "absolute", left: 10, top: "50%", marginTop: -10, color: "#111827", fontSize: 16 },
  footer: { paddingVertical: 16, alignItems: "flex-end" },
  next: { fontSize: 22, color: "#111827", fontFamily: "Gaegu", fontWeight: "700" },
});
