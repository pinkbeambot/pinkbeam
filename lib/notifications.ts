import { prisma } from './prisma'
import { NotificationType } from '@prisma/client'

interface CreateNotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

interface NotificationOptions {
  limit?: number
  offset?: number
  unreadOnly?: boolean
  type?: NotificationType
}

/**
 * Create a new notification for a user
 */
export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data as never || {},
      },
    })
    return { success: true, data: notification }
  } catch (error) {
    console.error('[notifications] Failed to create notification:', error)
    return { success: false, error: 'Failed to create notification' }
  }
}

/**
 * Get notifications for a user with pagination and filtering
 */
export async function getNotifications(userId: string, options: NotificationOptions = {}) {
  const { limit = 20, offset = 0, unreadOnly = false, type } = options

  try {
    const where: {
      userId: string
      isRead?: boolean
      type?: NotificationType
    } = { userId }

    if (unreadOnly) {
      where.isRead = false
    }

    if (type) {
      where.type = type
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ])

    return {
      success: true,
      data: notifications,
      meta: {
        total: totalCount,
        unread: unreadCount,
        limit,
        offset,
        hasMore: offset + notifications.length < totalCount,
      },
    }
  } catch (error) {
    console.error('[notifications] Failed to fetch notifications:', error)
    return { success: false, error: 'Failed to fetch notifications' }
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user can only mark their own notifications
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    if (notification.count === 0) {
      return { success: false, error: 'Notification not found or access denied' }
    }

    return { success: true }
  } catch (error) {
    console.error('[notifications] Failed to mark notification as read:', error)
    return { success: false, error: 'Failed to mark notification as read' }
  }
}

/**
 * Mark a single notification as unread
 */
export async function markAsUnread(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: false,
        readAt: null,
      },
    })

    if (notification.count === 0) {
      return { success: false, error: 'Notification not found or access denied' }
    }

    return { success: true }
  } catch (error) {
    console.error('[notifications] Failed to mark notification as unread:', error)
    return { success: false, error: 'Failed to mark notification as unread' }
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[notifications] Failed to mark all notifications as read:', error)
    return { success: false, error: 'Failed to mark all notifications as read' }
  }
}

/**
 * Get the count of unread notifications for a user
 */
export async function getUnreadCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    return { success: true, count }
  } catch (error) {
    console.error('[notifications] Failed to get unread count:', error)
    return { success: false, error: 'Failed to get unread count' }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string) {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    })

    if (result.count === 0) {
      return { success: false, error: 'Notification not found or access denied' }
    }

    return { success: true }
  } catch (error) {
    console.error('[notifications] Failed to delete notification:', error)
    return { success: false, error: 'Failed to delete notification' }
  }
}
