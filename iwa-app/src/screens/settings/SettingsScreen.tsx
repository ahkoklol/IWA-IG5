// src/screens/settings/SettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ArrowLeft, ChevronRight } from "lucide-react-native";

import { NotificationsSettingsScreen } from "./NotificationsSettingscreen";
import { PrivacySettingsScreen } from "./PrivacySettingsScreen";
import { LanguageSettingsScreen } from "./LanguageSettingsScreen";
import { HelpSettingsScreen } from "./HelpSettingsScreen";
import { AboutSettingsScreen } from "./AboutSettingsScreen";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";

import DeleteAccountConfirmationModal from "./DeleteAccountConfirmationModal";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

type SettingsSubPage =
  | "main"
  | "notifications"
  | "privacy"
  | "language"
  | "help"
  | "about";

export function SettingsScreen({ navigation, route }: Props) {
  const [currentSubPage, setCurrentSubPage] =
    useState<SettingsSubPage>("main");

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { onDeleteAccount } = route.params;

  const settingsItems = [
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Confidentialité" },
    { id: "language", label: "Langue" },
    { id: "help", label: "Aide et support" },
    { id: "about", label: "À propos" },
  ];

  const handleItemPress = (id: SettingsSubPage) => {
    setCurrentSubPage(id);
  };

  const handleSubPageBack = () => {
    setCurrentSubPage("main");
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    onDeleteAccount();
  };


  

  /* ----------------------------- */
  /*           SUB-PAGES           */
  /* ----------------------------- */

  if (currentSubPage === "notifications") {
    return <NotificationsSettingsScreen onBack={handleSubPageBack} />;
  }

  if (currentSubPage === "privacy") {
    return <PrivacySettingsScreen onBack={handleSubPageBack} />;
  }

  if (currentSubPage === "language") {
    return <LanguageSettingsScreen onBack={handleSubPageBack} />;
  }

  if (currentSubPage === "help") {
    return <HelpSettingsScreen onBack={handleSubPageBack} />;
  }

  if (currentSubPage === "about") {
    return <AboutSettingsScreen onBack={handleSubPageBack} />;
  }

  /* ----------------------------- */
  /*         MAIN SETTINGS         */
  /* ----------------------------- */

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réglages et préférences</Text>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleItemPress(item.id as SettingsSubPage)}
            style={styles.listItem}
            activeOpacity={0.5}
          >
            <Text style={styles.itemText}>{item.label}</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Zone danger : suppression de profil */}
        <View style={styles.dangerZone}>
        <TouchableOpacity
            onPress={handleOpenDeleteModal}
            style={styles.listItem}
            activeOpacity={0.7}
        >
            <Text style={styles.deleteText}>Supprimer mon profil</Text>
            {/* Pour aligner comme les autres, on ajoute un chevron transparent */}
            <ChevronRight size={20} color="transparent" />
        </TouchableOpacity>
        </View>
      </ScrollView>
      <DeleteAccountConfirmationModal
        visible={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
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

  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemText: {
    fontSize: 16,
    color: "#111",
  },

  dangerZone: {
  marginTop: 0,
  },

    deleteButton: {
    paddingVertical: 12,
    },
    deleteText: {
    fontSize: 16,
    color: "#EF4444",
    },

});
