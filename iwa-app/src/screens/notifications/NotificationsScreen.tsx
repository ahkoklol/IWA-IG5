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
import type { Notification } from "../../shared/types/notification";
import {
  fetchNotificationsByClientId,
  markNotificationAsRead,
} from "../../api/notificationApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationsScreenProps {
  onNotificationClick?: (notification: Notification) => void;
}

// TODO: replace these placeholders with real auth (Keycloak) integration
const MOCK_CLIENT_ID = "REPLACE_WITH_CONNECTED_CLIENT_ID";
const MOCK_ACCESS_TOKEN = "REPLACE_WITH_VALID_JWT_TOKEN";

export function NotificationsScreen({
  onNotificationClick,
}: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const getNotificationText = (notification: Notification) => {
    return notification.message ?? "";
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchNotificationsByClientId(
        MOCK_CLIENT_ID,
        MOCK_ACCESS_TOKEN,
      );
      setNotifications(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handlePress = async (notification: Notification) => {
    try {
      await markNotificationAsRead(
        notification.notificationId,
        MOCK_ACCESS_TOKEN,
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId
            ? { ...n, read: true }
            : n,
        ),
      );
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("navbar_notifications")}</Text>
      </View>

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
