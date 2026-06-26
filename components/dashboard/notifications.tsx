"use client"

import { useState } from "react"
import { Bell, CheckCircle2, Clock, AlertCircle, X, Check } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "pending" | "alert"
  timestamp: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Insurance Verified",
    message: "Marcus Bennett's insurance verified successfully",
    type: "success",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Appointment Scheduled",
    message: "New appointment scheduled for Dr. Carter",
    type: "success",
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    title: "Pending Verification",
    message: "3 patients waiting for insurance verification",
    type: "pending",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    title: "High Deductible Alert",
    message: "Sofia Alvarez has a $5,000 deductible",
    type: "alert",
    timestamp: "3 hours ago",
    read: true,
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="size-4 text-accent" />
    case "pending":
      return <Clock className="size-4 text-yellow-500" />
    case "alert":
      return <AlertCircle className="size-4 text-orange-500" />
    default:
      return <Bell className="size-4" />
  }
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="View notifications"
      >
        <Bell className="size-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-card">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} new notifications</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                title="Mark all as read"
              >
                Mark all
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex max-h-96 flex-col overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex flex-col gap-2 border-b border-border px-4 py-3 group hover:bg-secondary/30",
                  !notification.read && "bg-secondary/15",
                )}
              >
                <div className="flex items-start gap-2">
                  {getIcon(notification.type)}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      title="Mark as read"
                    >
                      <Check className="size-4" />
                    </button>
                  )}
                </div>
                <span className="text-xs text-muted-foreground ml-6">{notification.timestamp}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
