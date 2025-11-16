import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface NotificationsSettingsScreenProps {
  onBack: () => void;
}

export function NotificationsSettingsScreen({ onBack }: NotificationsSettingsScreenProps) {
  const [notificationPreferences, setNotificationPreferences] = useState({
    mySale: true,
    favoriteSale: true,
    removedByAI: true,
    addedToFavorite: true,
    newReview: true,
  });

  const handleToggle = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notifications = [
    { key: "mySale" as const, label: "Vente d'un de mes articles" },
    { key: "favoriteSale" as const, label: "Vente d'un des articles que j'avais en favori" },
    { key: "removedByAI" as const, label: "Suppression d'un de mes articles après signalements ou contrôle par IA" },
    { key: "addedToFavorite" as const, label: "Ajout d'un de mes articles en favori par un autre utilisateur" },
    { key: "newReview" as const, label: "Nouvelle évaluation ajoutée à mon profil" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
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

            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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

  // Cercles
  circleOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#7BCCEB", // bleu vide
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  circleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7BCCEB", // bleu rempli
  },
});
