export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'check';
    case 'warning':
      return 'alert-triangle';
    case 'error':
      return 'alert-octagon';
    default:
      return 'info';
  }
};

export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};