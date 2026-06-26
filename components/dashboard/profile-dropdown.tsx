"use client"

import { useState } from "react"
import { LogOut, Settings, User, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function ProfileDropdown() {
  const [open, setOpen] = useState(false)

  const profileItems = [
    { label: "Profile", icon: User, href: "#" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Logout", icon: LogOut, href: "#", isDanger: true },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2.5 rounded-lg p-1 pr-2 transition-colors hover:bg-secondary">
        <Avatar className="size-9">
          <AvatarImage src="/professional-woman-doctor-headshot.png" alt="" />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            DR
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-semibold text-foreground">Dr. Reyes</p>
          <p className="text-xs text-muted-foreground">Clinic Admin</p>
        </div>
        <ChevronDown className="hidden size-4 text-muted-foreground transition-transform sm:block" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Dr. Reyes</p>
          <p className="text-xs text-muted-foreground">clinic.admin@intakr.local</p>
        </div>
        <div className="flex flex-col py-1">
          {profileItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary",
                  item.isDanger && "text-destructive hover:bg-destructive/10",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </a>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
