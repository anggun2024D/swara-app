export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  report_id?: number;
  report?: {
    id: number;
    title: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BroadcastNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  target?: 'all' | 'users' | 'admins';
}