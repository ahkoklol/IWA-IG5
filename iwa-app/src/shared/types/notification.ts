//iwa-app/src/shared/types/notification.ts

export type NotificationType = "favorite" | "sale" | "review" | "removed";

export type Notification = {
  notificationId: string;
  message: string;
  type: string;
  read: boolean;
  date: string;
  clientId: string;
};



