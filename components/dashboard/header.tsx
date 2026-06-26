"use client"

import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/dashboard/notifications"
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown"
import { PatientSearch } from "@/components/dashboard/patient-search"
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

      {/* Patient Search */}
      <PatientSearch />

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsDropdown />

        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  )
}
