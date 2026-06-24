import { Button } from "@/components/ui/button"
import { UserPlus, ShieldCheck } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button size="lg" className="gap-2 shadow-sm">
        <UserPlus className="size-4.5" aria-hidden="true" />
        New Patient Intake
      </Button>
      <Button size="lg" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-accent">
        <ShieldCheck className="size-4.5" aria-hidden="true" />
        Verify Insurance
      </Button>
    </div>
  )
}
