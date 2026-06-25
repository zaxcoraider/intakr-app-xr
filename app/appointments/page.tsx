import { Plus } from "lucide-react"
import { PageShell } from "@/components/dashboard/page-shell"
import { Schedule } from "@/components/appointments/schedule"
import { Button } from "@/components/ui/button"

export default function AppointmentsPage() {
  return (
    <PageShell
      title="Appointments"
      description="Manage today's patient schedule and upcoming visits."
      actions={
        <Button>
          <Plus className="size-4" />
          Add Appointment
        </Button>
      }
    >
      <Schedule />
    </PageShell>
  )
}
