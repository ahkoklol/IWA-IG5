// iwa-app/src/screens/profil/ProfileMenuScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ChevronRight, LogOut } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import type { User } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

interface ProfileMenuScreenProps {
  currentUser: User;
  onMenuSelect: (menu: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function ProfileMenuScreen({
  currentUser,
  onMenuSelect,
  onLogout,
  onDeleteAccount,
}: ProfileMenuScreenProps) {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  const menuItems = [
    { id: "myProfile", label: t("profile_view_my_profile"), showAvatar: true },
    { id: "favorites", label: t("profile_favorites"), showAvatar: false },
    { id: "myProducts", label: t("profile_my_seeds"), showAvatar: false },
    { id: "transactions", label: t("profile_transactions"), showAvatar: false },
    { id: "settings", label: t("profile_settings"), showAvatar: false },
  ];

  const handleMenuPress = (id: string) => {
    onMenuSelect(id);

    switch (id) {
      case "myProfile":
        navigation.navigate("MyProfileScreen", { user: currentUser });
        break;

      case "favorites":
        navigation.navigate("Favorites");
        break;

      case "myProducts":
        navigation.navigate("MyProducts");
        break;

      case "transactions":
        navigation.navigate("Transactions", {});
        break;

      case "settings":
        navigation.navigate("Settings", { onDeleteAccount });
        break;

      default:
        break;
    }
  };

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("navbar_profile")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                {item.showAvatar && currentUser.avatar && (
                  <Image
                    source={{ uri: currentUser.avatar }}
                    style={styles.avatar}
                  />
                )}
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={20} />
            </TouchableOpacity>
          ))}

          {/* Logout button */}
          <TouchableOpacity
            onPress={onLogout}
            style={[styles.menuItem, styles.logoutItem]}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutText}>{t("profile_logout")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    color: "#111827",
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: "#111827",
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
  },
});

export default ProfileMenuScreen;
