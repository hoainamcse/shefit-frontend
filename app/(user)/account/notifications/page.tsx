'use client'

import type { Notification, UserNotification } from '@/models/notification'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

import {
  getNotifications,
  getUserNotifications,
  createUserNotification,
  updateUserNotification,
  queryKeyNotifications,
  queryKeyUserNotifications,
} from '@/network/client/notifications'
import { useSession } from '@/hooks/use-session'
import { htmlToText } from '@/lib/helpers'

export default function NotificationsPage() {
  const router = useRouter()
  const { session, isLoading: isUserLoading } = useSession()
  // Fetch all notifications
  const { data: notificationsData, isLoading: isNotificationsLoading } = useQuery({
    queryKey: [queryKeyNotifications],
    queryFn: () => getNotifications(),
    enabled: !!session,
  })

  // Fetch user's notifications if user is logged in
  const {
    data: userNotificationsData,
    isLoading: isUserNotificationsLoading,
    refetch: refetchUserNotifications,
  } = useQuery({
    queryKey: [queryKeyUserNotifications, session?.userId],
    queryFn: () => getUserNotifications(session?.userId as number),
    enabled: !!session?.userId,
  })

  // Create user notification mutation
  const createUserNotificationMutation = useMutation({
    mutationFn: ({ userId, notificationId }: { userId: number; notificationId: number }) => {
      return createUserNotification(userId, notificationId, { is_read: true })
    },
    onSuccess: () => {
      refetchUserNotifications()
    },
  })

  // Update user notification mutation
  const updateUserNotificationMutation = useMutation({
    mutationFn: ({ userId, notificationId }: { userId: number; notificationId: number }) => {
      return updateUserNotification(userId, notificationId, {
        is_read: true,
      })
    },
    onSuccess: () => {
      refetchUserNotifications()
    },
  })

  // Process user notifications into a map for easy lookup using useMemo
  const userNotificationsMap = useMemo(() => {
    const map: Record<number, UserNotification> = {}
    if (userNotificationsData?.data) {
      userNotificationsData.data.forEach((userNotification) => {
        map[userNotification.notification.id] = userNotification
      })
    }
    return map
  }, [userNotificationsData?.data])

  // Sort notifications by pinned status and then by date
  const sortedNotifications = notificationsData?.data
    ? [...notificationsData.data].sort((a, b) => {
        // First sort by pinned status
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1

        // Then sort by date (newest first)
        return new Date(b.notify_date).getTime() - new Date(a.notify_date).getTime()
      })
    : []

  // Not logged in state
  if (!session) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
        <p className="mb-4">Bạn cần đăng nhập để xem thông báo</p>
        <Link href="/auth/login?redirect=%2Faccount%2Fnotifications" className="text-primary hover:underline">
          Đến trang đăng nhập
        </Link>
      </div>
    )
  }

  const handleNotificationClick = async (notification: Notification) => {
    const userNotification = userNotificationsMap[notification.id]

    if (!userNotification) {
      // Create a new user notification if it doesn't exist
      createUserNotificationMutation.mutateAsync({
        userId: session.userId,
        notificationId: notification.id,
      })
    } else if (!userNotification.is_read) {
      // Mark as read if it exists but is unread
      updateUserNotificationMutation.mutateAsync({
        userId: session.userId,
        notificationId: notification.id,
      })
    }

    // Navigate to notification detail
    router.push(`/notifications/${notification.id}`)
  }

  // Loading state
  if (isUserLoading) {
    return <div className="p-4 text-center">Đang tải...</div>
  }

  // Data loading state
  if (isNotificationsLoading || isUserNotificationsLoading) {
    return <div className="p-4 text-center">Đang tải thông báo...</div>
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Thông báo</h1>

      <div className="space-y-3 sm:space-y-4">
        {sortedNotifications.length === 0 ? (
          <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          sortedNotifications.map((notification) => {
            const userNotification = userNotificationsMap[notification.id]
            const isUnread = userNotification ? !userNotification.is_read : true

            // Check if notification is newer than 3 days
            const notifyDate = new Date(notification.notify_date)
            const threeDaysAgo = new Date()
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
            const isRecent = notifyDate > threeDaysAgo

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 sm:p-4 border rounded-lg shadow-sm cursor-pointer transition-colors ${
                  isUnread ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start">
                  {/* Left indicator bar for unread status */}
                  {isUnread && <div className="w-1 self-stretch bg-primary rounded-full mr-2 sm:mr-3 my-1"></div>}

                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <h3 className={`font-medium truncate ${isUnread ? 'font-bold text-primary-700' : ''}`}>
                        {notification.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {isUnread && isRecent && (
                          <span className="px-1.5 py-0.5 text-xs font-medium bg-primary text-white rounded whitespace-nowrap">
                            Mới
                          </span>
                        )}
                        {isUnread && !isRecent && (
                          <span className="inline-block w-2 h-2 bg-primary rounded-full self-center"></span>
                        )}
                        {notification.pinned && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-md whitespace-nowrap">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.333 4v5.886L7.172 8.594 6 9.767l4 4 4-4-1.172-1.173-2.162 1.292V4h-1.333z" />
                            </svg>
                            Ghim
                          </span>
                        )}
                      </div>
                    </div>

                    {notification.content && (
                      <p className="mt-1 text-gray-600 text-xs sm:text-sm line-clamp-2">
                        {htmlToText(notification.content)}
                      </p>
                    )}

                    {/* Mobile date display */}
                    <div className="text-xs text-gray-500 mt-1 sm:hidden">
                      {new Date(notification.notify_date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Desktop date display */}
                  <div className="hidden sm:block text-xs text-gray-500 ml-3 whitespace-nowrap">
                    {new Date(notification.notify_date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
