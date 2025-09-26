export type UUID = string; // UUID4 format assumed as string

// -----------------------------
// 🔹 Base Notification Interfaces
// -----------------------------

export interface NotificationBase {
  sender_id?: UUID | null;
  title: string;
  message: string;
  link?: string | null;
  image?: string | null;
}

// -----------------------------
// 🔹 Input Interfaces
// -----------------------------

export interface NotificationCreate extends NotificationBase {
  user_ids: UUID[];
}

export interface NotificationUpdate {
  id: UUID;
  sender_id?: UUID | null;
  title?: string;
  message?: string;
  link?: string | null;
  image?: string | null;
}

export interface NotificationReadUpdate {
  notification_id: UUID;
  user_id: UUID;
  is_read: boolean;
}

export interface RemoveUpdate {
  notification_id: UUID;
  user_id: UUID;
}

// -----------------------------
// 🔹 Output Interfaces
// -----------------------------

export interface NotificationUserResponse {
  id: UUID;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  has_read: boolean; // Reflects `NotificationRecipient.is_read`
}

export interface NotificationOnlyResponse extends NotificationBase {
  id: UUID;
  created_at: string; // ISO format datetime
}

export interface NotificationResponse extends NotificationBase {
  id: UUID;
  created_at: string;
  recipients: NotificationUserResponse[];
}
