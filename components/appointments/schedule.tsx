import { Clock, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Appointment = {
  name: string
  time: string
  type: string
  status: "Confirmed" | "Waiting"
  avatar?: string
}

const appointments: Appointment[] = [
  { name: "Marcus Reed", time: "9:00 AM", type: "Check-up", status: "Confirmed", avatar: "/patients/patient-1.png" },
  { name: "Sofia Alvarez", time: "9:45 AM", type: "Follow-up", status: "Confirmed", avatar: "/patients/patient-2.png" },
  { name: "Henry Walsh", time: "10:30 AM", type: "Consultation", status: "Waiting", avatar: "/patients/patient-3.png" },
  { name: "Daniel Kim", time: "11:15 AM", type: "Lab Review", status: "Confirmed", avatar: "/patients/patient-4.png" },
  { name: "Olivia Bennett", time: "1:00 PM", type: "Check-up", status: "Waiting", avatar: "/patients/patient-5.png" },
  { name: "Marcus Reed", time: "2:30 PM", type: "Physical Therapy", status: "Confirmed", avatar: "/patients/patient-1.png" },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
}

export function Schedule() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Today&apos;s Schedule</h2>
            <span className="text-sm text-muted-foreground">{appointments.length} appointments</span>
          </div>
          <ul className="divide-y divide-border">
            {appointments.map((appt, i) => (
              <li key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="flex w-16 shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Clock className="size-4 text-primary" />
                  {appt.time}
                </div>
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={appt.avatar || "/placeholder.svg"} alt={appt.name} />
                  <AvatarFallback>{initials(appt.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{appt.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Stethoscope className="size-3.5" />
                    {appt.type}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    appt.status === "Confirmed"
                      ? "border-transparent bg-accent text-accent-foreground"
                      : "border-orange-200 bg-orange-100 text-orange-700"
                  }
                >
                  {appt.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Day summary */}
      <div className="lg:col-span-1">
        <Card className="p-6">
          <h3 className="font-heading text-base font-semibold text-foreground">Day Summary</h3>
          <p className="mt-1 text-sm text-muted-foreground">Thursday, June 25</p>
          <div className="mt-5 flex flex-col gap-4">
            <SummaryRow label="Confirmed" value={appointments.filter((a) => a.status === "Confirmed").length} accent />
            <SummaryRow label="Waiting" value={appointments.filter((a) => a.status === "Waiting").length} />
            <SummaryRow label="Total slots" value={appointments.length} />
          </div>
        </Card>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          accent
            ? "font-heading text-lg font-bold text-primary"
            : "font-heading text-lg font-bold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  )
}
