"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserPlus, ShieldCheck } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        size="lg"
        className="gap-2 shadow-sm"
        nativeButton={false}
        render={<Link href="/patient-intake" />}
      >
        <UserPlus className="size-4.5" aria-hidden="true" />
        New Patient Intake
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="gap-2 border-primary/30 text-primary hover:bg-accent"
        nativeButton={false}
        render={<Link href="/insurance-verify" />}
      >
        <ShieldCheck className="size-4.5" aria-hidden="true" />
        Verify Insurance
      </Button>
    </div>
  )
}
