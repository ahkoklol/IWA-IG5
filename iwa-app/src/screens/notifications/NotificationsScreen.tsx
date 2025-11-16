// src/screens/notifications/NotificationsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { Notification } from "../../shared/types";
import { demoNotifications } from "../../mocks/products";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationsScreenProps {
  onNotificationClick?: (notification: Notification) => void;
}

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case "favorite":
      return `${notification.user.username} a ajouté votre article en favori`;
    case "sale":
      return `Votre article a été vendu à ${notification.user.username}`;
    case "review":
      return `${notification.user.username} a laissé une évaluation sur votre profil`;
    case "removed":
      return `Votre annonce a été supprimée car elle ne respectait pas nos conditions d'utilisation`;
    default:
      return "";
  }
};

export function NotificationsScreen({ onNotificationClick }: NotificationsScreenProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(demoNotifications);

  const navigation = useNavigation<NavigationProp>();

  const handlePress = (notification: Notification) => {
    // Marquer comme lue dans le mock local
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigation vers le détail du produit
    navigation.navigate("ProductDetail", {
      productId: String(notification.product.id),
    });

    // Remonter l’info si un callback est fourni
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  return (
    <View style={styles.container}>
      {/* Phone notch simulation */}
      <View style={styles.notch} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((notification) => {
          const itemStyle = [
            styles.notificationItem,
            notification.type === "removed"
              ? styles.notificationRemoved
              : !notification.read
              ? styles.notificationUnread
              : null,
          ];

          return (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handlePress(notification)}
              style={itemStyle}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: notification.product.images[0] }}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>
                  {getNotificationText(notification)}
                </Text>
                <Text style={styles.notificationDate}>
                  {notification.date}
                </Text>
              </View>

              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 128,
  },
  notificationItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notificationRemoved: {
    backgroundColor: "#FEF2F2",
  },
  notificationUnread: {
    backgroundColor: "#E5F6FC",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: "#111827",
  },
  notificationDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7BCCEB",
  },
});
