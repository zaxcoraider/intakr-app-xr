"use client"

import { Search, Menu, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/dashboard/notifications"
import { SidebarContent } from "./sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm md:px-6">
      {/* Mobile nav trigger */}
      <Sheet>
        <SheetTrigger
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients..."
          className="h-10 rounded-lg border-border bg-secondary/60 pl-9 text-sm focus-visible:bg-card"
          aria-label="Search patients"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsDropdown />

        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 rounded-lg p-1 pr-2 transition-colors hover:bg-secondary">
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
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </button>
      </div>
    </header>
  )
}
