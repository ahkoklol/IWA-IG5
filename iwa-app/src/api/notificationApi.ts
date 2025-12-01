// iwa-app/src/api/notificationApi.ts
import type { Notification } from "../shared/types/notification";
import { NOTIFICATION_BASE_URL } from "./config";
import { httpClient } from "./httpClient";

/**
 * Fetch notifications for a given client.
 * In the future, Keycloak token should be provided here.
 */
export async function fetchNotificationsByClientId(
  clientId: string,
  token?: string,
): Promise<Notification[]> {
  const response = await httpClient.get<Notification[]>(
    `${NOTIFICATION_BASE_URL}/notification/${clientId}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  return response.data;
}

/**
 * Mark a notification as read.
 */
export async function markNotificationAsRead(
  notificationId: string,
  token?: string,
): Promise<void> {
  await httpClient.put(
    `${NOTIFICATION_BASE_URL}/notification/${notificationId}`,
    undefined,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
}

export async function sendReviewNotification(
  {
    sellerId,
    reviewerId, // still unused but kept in case you need it later
    productId,  // still unused but kept in case you need it later
    message,
  }: {
    sellerId: string;
    reviewerId: string;
    productId: string;
    message: string;
  },
  token?: string,
): Promise<Notification> {
  const response = await httpClient.post<Notification>(
    `${NOTIFICATION_BASE_URL}/notification`,
    {
      clientId: sellerId,
      type: "REVIEW_LEFT",
      message,
      date: new Date(),
      read: false,
    },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  return response.data;
}

export async function sendRepostDecisionNotification(
  {
    sellerId,
    productName,
    accepted,
  }: {
    sellerId: string;
    productName: string;
    accepted: boolean;
  },
  token?: string,
): Promise<Notification> {
  const type = accepted
    ? "REPOST_REQUEST_ACCEPTED"
    : "REPOST_REQUEST_REJECTED";

  const message = accepted
    ? `Votre annonce "${productName}" a été republiée.`
    : `Votre requête de remise en ligne pour "${productName}" a été rejetée.`;

  const response = await httpClient.post<Notification>(
    `${NOTIFICATION_BASE_URL}/notification`,
    {
      clientId: sellerId,
      type,
      message,
      date: new Date(),
      read: false,
    },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  return response.data;
}
