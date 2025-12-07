import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Screen } from "../../components/Screen";
import { useTranslation } from "react-i18next";

interface PrivacySettingsScreenProps {
  onBack: () => void;
}

export function PrivacySettingsScreen({ onBack }: PrivacySettingsScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("settings_privacy_title")}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.paragraph}>{t("settings_privacy_text1")}</Text>

          <Text style={styles.paragraph}>{t("settings_privacy_text2")}</Text>

          <Text style={styles.paragraph}>{t("settings_privacy_text3")}</Text>

          <Text style={styles.paragraph}>{t("settings_privacy_text4")}</Text>
        </ScrollView>
      </View>
    </Screen>
  );
}

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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 14,
  },
});
