import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { SignupData1 } from "./RegisterScreen1";

export interface SignupData2 {
  address: string;
  postalCode: string;
  country: string;
  nationality: string;
}

export default function RegisterScreen2() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1 } = (route.params as { step1: SignupData1 }) || {};

  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");

  const handleNext = () => {
    const step2: SignupData2 = { address, postalCode, country, nationality };
    navigation.navigate("Register3", { step1, step2 });
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
            <Text style={styles.label}>Adresse</Text>
            <TextInput value={address} onChangeText={setAddress} style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>Code Postal</Text>
            <TextInput value={postalCode} onChangeText={setPostalCode} keyboardType="number-pad" style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>Pays</Text>
            <TextInput value={country} onChangeText={setCountry} placeholder="Ex: France" style={styles.input} />
          </View>

          <View>
            <Text style={styles.label}>Nationalité</Text>
            <TextInput value={nationality} onChangeText={setNationality} placeholder="Ex: Française" style={styles.input} />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={handleNext}>
            <Text style={styles.next}>Suivant</Text>
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
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between", paddingBottom: 16 },
  label: { fontSize: 14, color: "#111827", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: "#111827" },
  footer: { paddingVertical: 16, alignItems: "flex-end" },
  next: { fontSize: 22, color: "#111827", fontFamily: "Gaegu", fontWeight: "700" },
});
