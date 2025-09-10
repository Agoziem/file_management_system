// -----------------------------
// 🔹 Response Models
// -----------------------------

export interface NotificationUserResponse {
  /** User info in the context of a notification + read status */
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  has_read: boolean; // From NotificationRecipient.is_read
}

export interface NotificationOnlyResponse {
  /** Notification without recipient details */
  id: string;
  sender_id: string | null;
  title: string;
  message: string;
  link: string | null;
  image: string | null;
  created_at: string; // ISO datetime string
}

export interface NotificationResponse {
  /** Complete notification with recipients */
  id: string;
  sender_id: string | null;
  title: string;
  message: string;
  link: string | null;
  image: string | null;
  created_at: string; // ISO datetime string
  recipients: NotificationUserResponse[];
}

// -----------------------------
// 🔹 List & Pagination Models
// -----------------------------

export interface NotificationList {
  items: NotificationResponse[];
  count: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface UserNotificationList {
  /** Notifications for a specific user with read status */
  items: Array<{
    id: string;
    sender_id: string | null;
    title: string;
    message: string;
    link: string | null;
    image: string | null;
    created_at: string;
    is_read: boolean;
  }>;
  count: number;
  unread_count: number;
}

// -----------------------------
// 🔹 Utility Types
// -----------------------------

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_today: number;
  notifications_this_week: number;
}

export interface NotificationPreview {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface BulkNotificationResult {
  success_count: number;
  failure_count: number;
  total_count: number;
  failed_user_ids: string[];
}

// -----------------------------
// 🔹 Action Response Types
// -----------------------------

export interface NotificationActionResponse {
  success: boolean;
  message: string;
  notification_id: string;
}

export interface BulkReadUpdateResponse {
  success: boolean;
  message: string;
  updated_count: number;
  failed_notifications: string[];
}

export interface NotificationDeleteResponse {
  success: boolean;
  message: string;
  deleted_count: number;
}

// -----------------------------
// 🔹 Real-time Events
// -----------------------------

export interface NotificationEvent {
  type: 'new_notification' | 'notification_read' | 'notification_deleted';
  notification: NotificationOnlyResponse;
  user_id: string;
  timestamp: string;
}

export interface NotificationSocketData {
  event: string;
  data: NotificationEvent;
}