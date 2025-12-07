// typescript
import React, {useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import type { SignupData1 } from "./RegisterScreen1";
import AuthService from "../../components/auth/AuthService";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/authContext";



export interface SignupData2 {
  address: string;
  postalCode: string;
  country: string;
  nationality: string;
}

export default function RegisterScreen2() {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { step1 } = (route.params as { step1: SignupData1 }) || {};

  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [nationality, setNationality] = useState("");
  const { t } = useTranslation();

  const { state } = useContext(AuthContext);
  useEffect(() => {
    AuthService.setJwtToken(state.accessToken);
  }, [state.accessToken]);

  const handleNext = async () => {
    const step2: SignupData2 = { address, postalCode, country, nationality };
    try {
      AuthService.setRegisterStep2(step2);
      console.log("RegisterScreen2 - handleNext - step2 set", step2);

      if (!state.id_user) {
        console.log("--------------PROBLEME")
      }
      console.log("RegisterScreen2 - handleNext - idToken", state.id_user);
      // Appel de la route backend via AuthService
      const result = await AuthService.registerSubmit(state.id_user);
      if (!result || !result.ok) {
        console.log("petit souci", result?.error);
        Alert.alert(t("error") ?? "Erreur", String(result?.error ?? "unknown"));
        return;
      }
     console.log("yay")
    } catch (e: any) {
      console.log("petit souci", e);
      Alert.alert(t("error") ?? "Erreur", String(e ?? "unknown"));
    }
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
              <Text style={styles.label}>{t("register_address")}</Text>
              <TextInput value={address} onChangeText={setAddress} style={styles.input} />
            </View>

            <View>
              <Text style={styles.label}>{t("register_postal_code")}</Text>
              <TextInput value={postalCode} onChangeText={setPostalCode} keyboardType="number-pad" style={styles.input} />
            </View>

            <View>
              <Text style={styles.label}>{t("register_country")}</Text>
              <TextInput value={country} onChangeText={setCountry} placeholder={t("register_country_placeholder")} style={styles.input} />
            </View>

            <View>
              <Text style={styles.label}>{t("register_nationality")}</Text>
              <TextInput value={nationality} onChangeText={setNationality} placeholder={t("register_nationality_placeholder")}  style={styles.input} />
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
    justifyContent: "space-between",
    paddingBottom: 16,
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
  footer: { paddingVertical: 16, alignItems: "flex-end" },
  next: {
    fontSize: 22,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
  },
});