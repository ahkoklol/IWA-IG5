// src/screens/settings/LanguageSettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { Screen } from "../../components/Screen";

type LangCode = "fr" | "en" | "es" | "de";

interface LanguageSettingsScreenProps {
  onBack: () => void;
}

export function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
  const { t, i18n } = useTranslation();

  // Initialize selected language from i18n
  const initialLang = (i18n.language?.split("-")[0] as LangCode) || "fr";
  const [selectedLanguage, setSelectedLanguage] = useState<LangCode>(initialLang);

  const languages: { code: LangCode; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
  ];

  const handleSelectLanguage = (code: LangCode) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("settings_language")}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleSelectLanguage(lang.code)}
              style={styles.row}
              activeOpacity={0.7}
            >
              <RadioCircle checked={selectedLanguage === lang.code} />
              <Text style={styles.label}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

/* ------------------------------- */
/*       BLUE ROUND RADIO BUTTON   */
/* ------------------------------- */

function RadioCircle({ checked }: { checked: boolean }) {
  return (
    <View style={styles.circleOuter}>
      {checked && <View style={styles.circleInner} />}
    </View>
  );
}

/* ------------------------------- */
/*              STYLES             */
/* ------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "500",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },

  label: {
    fontSize: 16,
    flex: 1,
  },

  circleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#7BCCEB",
    justifyContent: "center",
    alignItems: "center",
  },

  circleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7BCCEB",
  },
});
