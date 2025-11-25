//iwa-app/src/api/notificationApi.ts
import type { Notification } from "../shared/types/notification";
import { NOTIFICATION_BASE_URL } from "./config";

export async function fetchNotificationsByClientId(clientId: string) {
  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationAsRead(notificationId: string) {
  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification/${notificationId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
}

export async function sendReviewNotification({
  sellerId,
  reviewerId,
  productId,
  message,
}: {
  sellerId: string;
  reviewerId: string;
  productId: string;
  message: string;
}) {
  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: sellerId,        // celui qui reçoit la notif = Vendeur
      type: "REVIEW_LEFT",
      message,
      date: new Date(),
      read: false,
    }),
  });

  if (!res.ok) throw new Error("Failed to send review notification");
  return res.json();
}

export async function sendRepostDecisionNotification({
  sellerId,
  productName,
  accepted,
}: {
  sellerId: string;
  productName: string;
  accepted: boolean;
}) {
  const type = accepted
    ? "REPOST_REQUEST_ACCEPTED"
    : "REPOST_REQUEST_REJECTED";

  const message = accepted
    ? `Votre annonce "${productName}" a été republiée.`
    : `Votre requête de remise en ligne pour "${productName}" a été rejetée.`;

  const res = await fetch(`${NOTIFICATION_BASE_URL}/notification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: sellerId, // vendeur qui reçoit la notif
      type,
      message,
      date: new Date(),
      read: false,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send repost decision notification");
  }

  return res.json();
}

