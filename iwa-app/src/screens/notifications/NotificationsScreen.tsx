// src/screens/notifications/NotificationsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { Screen } from "../../components/Screen";

// ✅ On utilise maintenant le type Notification du backend
import type { Notification } from "../../shared/types/notification";

// ✅ On utilise l’API réelle
import {
  fetchNotificationsByClientId,
  markNotificationAsRead,
} from "../../api/notificationApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationsScreenProps {
  onNotificationClick?: (notification: Notification) => void;
}

// ⚠️ En attendant la vraie auth : on simule un utilisateur connecté
const MOCK_CLIENT_ID = "client-123";

export function NotificationsScreen({
  onNotificationClick,
}: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  // Le back construit déjà le texte => on affiche directement notification.message
  const getNotificationText = (notification: Notification) => {
    return notification.message ?? "";
  };

  // Chargement des notifs depuis le microservice
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotificationsByClientId(MOCK_CLIENT_ID);
      setNotifications(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // En vrai : utiliser l’ID du user connecté via ton système d’auth
    loadNotifications();
  }, []);

  const handlePress = async (notification: Notification) => {
    // 1) Appel au backend pour marquer comme lue
    try {
      await markNotificationAsRead(notification.notificationId);

      // 2) Mise à jour en local
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId
            ? { ...n, read: true }
            : n
        )
      );
    } catch (e) {
      // Pour l’instant on log juste l’erreur, on pourra ajouter un toast plus tard
      console.error("Failed to mark notification as read", e);
    }

    // 3) Navigation : pour l’instant on ne connaît pas le produit / user côté back,
    // donc on ne redirige nulle part. On garde uniquement le callback externe.
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text>{t("error_generic")}</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("navbar_notifications")}</Text>
      </View>

      {/* Notifications list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((notification) => {
          const itemStyle = [
            styles.notificationItem,
            !notification.read ? styles.notificationUnread : null,
          ];

          return (
            <TouchableOpacity
              key={notification.notificationId}
              onPress={() => handlePress(notification)}
              style={itemStyle}
              activeOpacity={0.7}
            >
              {/* On n’a plus d’image produit ni de seller dans le modèle backend,
                  donc on affiche juste texte + date pour l’instant */}
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>
                  {getNotificationText(notification)}
                </Text>
                <Text style={styles.notificationDate}>
                  {new Date(notification.date).toLocaleString()}
                </Text>
              </View>

              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}

        {notifications.length === 0 && (
          <View style={styles.center}>
            <Text>{t("notif_empty")}</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
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
  notificationUnread: {
    backgroundColor: "#E5F6FC",
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorDetails: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
  },
});
