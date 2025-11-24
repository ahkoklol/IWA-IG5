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
import { useTranslation } from "react-i18next";

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({
  onBack,
}: NotificationsSettingsScreenProps) {
  const { t } = useTranslation();

  const [notificationPreferences, setNotificationPreferences] = useState({
    mySale: true,
    favoriteSale: true,
    removedByAI: true,
    addedToFavorite: true,
    newReview: true,
  });

  const handleToggle = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notifications: {
    key: keyof typeof notificationPreferences;
    labelKey:
      | "settings_sale_my_item"
      | "settings_sale_favorite_item"
      | "settings_deleted_by_report"
      | "settings_added_favorite"
      | "settings_new_review";
  }[] = [
    { key: "mySale", labelKey: "settings_sale_my_item" },
    { key: "favoriteSale", labelKey: "settings_sale_favorite_item" },
    { key: "removedByAI", labelKey: "settings_deleted_by_report" },
    { key: "addedToFavorite", labelKey: "settings_added_favorite" },
    { key: "newReview", labelKey: "settings_new_review" },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("navbar_notifications")}
          </Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleToggle(item.key)}
              style={styles.row}
              activeOpacity={0.7}
            >
              <RadioCircle checked={notificationPreferences[item.key]} />
              <Text style={styles.label}>{t(item.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}

/* ------------------------------- */
/*    CERCLE BLEU PERSONNALISÉ     */
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
    paddingVertical: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
  },

  label: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },

  circleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#7BCCEB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  circleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7BCCEB",
  },
});
