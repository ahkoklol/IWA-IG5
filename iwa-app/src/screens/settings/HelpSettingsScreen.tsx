import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Screen } from "../../components/Screen";
import { useTranslation } from "react-i18next";

interface HelpSettingsScreenProps {
  onBack: () => void;
}

export function HelpSettingsScreen({ onBack }: HelpSettingsScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("settings_support")}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.paragraph}>{t("settings_support_text1")}</Text>

          <Text style={styles.paragraph}>{t("settings_support_text2")}</Text>

          <Text style={styles.paragraph}>{t("settings_support_text3")}</Text>

          {/* Email box */}
          <View style={styles.emailBox}>
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:support@bonnegraine.com")}
            >
              <Text style={styles.emailText}>support@bonnegraine.com</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.paragraph}>{t("settings_support_text4")}</Text>
        </ScrollView>
      </View>
    </Screen>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 16,
  },

  emailBox: {
    backgroundColor: "rgba(123, 204, 235, 0.12)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  emailText: {
    color: "#7BCCEB",
    fontSize: 16,
    fontWeight: "500",
  },
});
