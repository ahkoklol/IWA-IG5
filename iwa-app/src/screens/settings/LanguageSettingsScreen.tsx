import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Screen } from "../../components/Screen";

interface LanguageSettingsScreenProps {
  onBack: () => void;
}

export function LanguageSettingsScreen({ onBack }: LanguageSettingsScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en">("fr");

  const languages = [
    { code: "fr" as const, label: "Français" },
    { code: "en" as const, label: "English" },
  ];

  return (
    <Screen>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Langue</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setSelectedLanguage(lang.code)}
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
/*    RADIO BUTTON ROND BLEU       */
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
