"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  CalendarDays,
  Settings,
  LifeBuoy,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Patient Intake", icon: ClipboardList, href: "/patient-intake" },
  { label: "Patients", icon: Users, href: "/patients" },
  { label: "Insurance Verify", icon: ShieldCheck, href: "/insurance-verify" },
  { label: "Appointments", icon: CalendarDays, href: "/appointments" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Image
          src="/logo.png"
          alt="Intakr"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6" aria-label="Main navigation">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Support card */}
      <div className="px-3 pb-6">
        <div className="rounded-xl bg-accent p-4">
          <div className="flex items-center gap-2 text-accent-foreground">
            <LifeBuoy className="size-5" strokeWidth={2} />
            <span className="text-sm font-semibold">Need help?</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-accent-foreground/80">
            Our support team is available 24/7 to assist your practice.
          </p>
          <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
      <SidebarContent />
    </aside>
  )
}
