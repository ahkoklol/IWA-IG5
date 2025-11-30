// iwa-app/src/api/notificationApi.ts
import type { Notification } from "../shared/types/notification";
import { NOTIFICATION_BASE_URL } from "./config";

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed with status ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function handleVoidResponse(res: Response): Promise<void> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed with status ${res.status}: ${text}`);
  }
}

/**
 * Fetch notifications for a given client.
 * In the future, Keycloak token should be provided here.
 */
export async function fetchNotificationsByClientId(
  clientId: string,
  token?: string,
): Promise<Notification[]> {
  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification/${clientId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return handleJsonResponse<Notification[]>(res);
}

/**
 * Mark a notification as read.
 */
export async function markNotificationAsRead(
  notificationId: string,
  token?: string,
): Promise<void> {
  const res = await fetch(
    `${NOTIFICATION_BASE_URL}/notification/${notificationId}`,
    {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  return handleVoidResponse(res);
}

export async function sendReviewNotification(
  {
    sellerId,
    reviewerId,
    productId,
    message,
  }: {
    sellerId: string;
    reviewerId: string;
    productId: string;
    message: string;
  },
  token?: string,
) {
  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      clientId: sellerId, // receiver = seller
      type: "REVIEW_LEFT",
      message,
      date: new Date(),
      read: false,
    }),
  });

  return handleJsonResponse<Notification>(res);
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
) {
  const type = accepted
    ? "REPOST_REQUEST_ACCEPTED"
    : "REPOST_REQUEST_REJECTED";

  const message = accepted
    ? `Votre annonce "${productName}" a été republiée.`
    : `Votre requête de remise en ligne pour "${productName}" a été rejetée.`;

  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      clientId: sellerId,
      type,
      message,
      date: new Date(),
      read: false,
    }),
  });

  return handleJsonResponse<Notification>(res);
}
