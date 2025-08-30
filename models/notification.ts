type Notification = {
  id: number
  title: string
  content: string
  notify_date: string
  pinned: boolean
}

type NotificationPayload = Omit<Notification, 'id'>

type UserNotification = {
  user_id: number
  notification: Notification
  is_read: boolean
}

type UserNotificationPayload = Omit<UserNotification, 'user_id' | 'notification'>

export type { Notification, NotificationPayload }
export type { UserNotification, UserNotificationPayload }
