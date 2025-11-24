import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const BG = "#B9ECFF";

type LangCode = "fr" | "en" | "es" | "de";

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const initialLang = (i18n.language?.split("-")[0] as LangCode) || "fr";
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>(initialLang);

  const handleSelectLanguage = (code: LangCode) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Header avec flèche retour, aligné au style global */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={10}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Contenu centré, comme Login */}
      <View style={styles.container}>
        <Text style={styles.title}>{t("settings_language")}</Text>

        <View style={styles.card}>
          {LANGUAGES.map((lang) => {
            const isActive = selectedLanguage === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => handleSelectLanguage(lang.code)}
                style={[
                  styles.langRow,
                  isActive && styles.langRowActive,
                ]}
                android_ripple={{ color: "rgba(0,0,0,0.05)" }}
              >
                <View style={styles.radioOuter}>
                  {isActive && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.langLabel,
                    isActive && styles.langLabelActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleBack}
          style={styles.submit}
        >
          <Text style={styles.submitText}>{t("login_submit")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
    color: "#111827",
    fontFamily: "Gaegu",
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  langRowActive: {
    backgroundColor: "rgba(123, 204, 235, 0.12)",
    borderRadius: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#7BCCEB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7BCCEB",
  },
  langLabel: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  langLabelActive: {
    fontWeight: "700",
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
