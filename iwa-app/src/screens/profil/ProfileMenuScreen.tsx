//iwa-app/src/screens/profil/ProfileMenuScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ChevronRight, LogOut} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { User } from "../../shared/types";
import type { RootStackParamList } from "../../navigation/RootNavigator";

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

  const menuItems = [
    { id: "myProfile", label: "Voir mon profil", showAvatar: true },
    { id: "favorites", label: "Favoris", showAvatar: false },
    { id: "myProducts", label: "Mes graines", showAvatar: false },
    { id: "transactions", label: "Mes transactions", showAvatar: false },
    { id: "settings", label: "Réglages et préférences", showAvatar: false },
  ];

  const handleMenuPress = (id: string) => {
    // On garde l'appel pour compatibilité avec le parent
    onMenuSelect(id);

    switch (id) {
      case "myProfile":
        // On ouvre l'écran profil détaillé avec les infos du user
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Phone notch simulation */}
      <View style={styles.notch} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

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
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  notch: {
    width: 128,
    height: 32,
    backgroundColor: "#000000",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignSelf: "center",
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
