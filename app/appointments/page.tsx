import { PageShell } from "@/components/dashboard/page-shell"
import { AppointmentManager } from "@/components/appointments/appointment-manager"

export default function AppointmentsPage() {
  return (
    <PageShell
      title="Appointments"
      description="Schedule new visits and manage upcoming patient appointments."
    >
      <AppointmentManager />
    </PageShell>
  )
}
