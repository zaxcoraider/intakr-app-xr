"use client"

import { useRef, useState, useTransition, useMemo } from "react"
import useSWR from "swr"
import {
  CalendarPlus,
  Clock,
  CalendarDays,
  Stethoscope,
  Loader2,
  XCircle,
  User,
  X,
  StickyNote,
} from "lucide-react"
import {
  createAppointment,
  getAppointments,
  cancelAppointment,
  type Appointment,
} from "@/app/actions/appointmentActions"
import { getPatients } from "@/app/actions/patientActions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const APPOINTMENT_TYPES = ["Check-up", "Follow-up", "Emergency", "Consultation", "Lab Review"]
const DOCTORS = ["Dr. Reyes", "Dr. Carter", "Dr. Patel", "Dr. Nguyen"]

const STATUS_STYLES: Record<string, string> = {
  Scheduled: "bg-accent text-accent-foreground border-transparent",
  Cancelled: "bg-secondary text-muted-foreground border-transparent",
  Completed: "bg-primary/10 text-primary border-transparent",
}

const TYPE_STYLES: Record<string, string> = {
  Emergency: "border-orange-200 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Follow-up": "border-primary/20 bg-primary/10 text-primary",
  Consultation: "border-purple-200 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  default: "border-transparent bg-accent text-accent-foreground",
}

function formatDateTime(date: string, time: string) {
  if (!date) return time || ""
  const d = new Date(`${date}T${time || "00:00"}`)
  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim()
  const datePart = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  const timePart = time
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : ""
  return timePart ? `${datePart} · ${timePart}` : datePart
}

export function AppointmentManager() {
  const {
    data: appointments = [],
    mutate,
    isLoading,
  } = useSWR<Appointment[]>("appointments", () => getAppointments(), {
    refreshInterval: 30000,
  })

  const { data: patients = [] } = useSWR("patients-appt", () => getPatients(), {
    refreshInterval: 60000,
  })

  const [type, setType] = useState("")
  const [doctor, setDoctor] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [cancelling, setCancelling] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("type", type)
    formData.set("doctor", doctor)

    // If patient was selected from dropdown, attach their ID
    const selectedPatient = (patients as any[]).find((p: any) => p.patientId === selectedPatientId)
    if (selectedPatient) {
      formData.set("patientName", selectedPatient.name)
      formData.set("patientId", selectedPatient.patientId)
    }

    startTransition(async () => {
      const result = await createAppointment(formData)
      setFeedback({ ok: result.success, msg: result.message ?? "" })
      if (result.success) {
        formRef.current?.reset()
        setType("")
        setDoctor("")
        setSelectedPatientId("")
        mutate()
      }
    })
  }

  async function handleCancel(appt: Appointment) {
    setCancelling(appt.appointmentId)
    await cancelAppointment(appt.appointmentId, appt.date)
    mutate()
    setCancelling(null)
  }

  const { upcoming, past } = useMemo(() => {
    const now = new Date().toISOString().slice(0, 16)
    return {
      upcoming: appointments.filter(
        (a) => a.status !== "Cancelled" && `${a.date}T${a.time}` >= now,
      ),
      past: appointments.filter(
        (a) => a.status === "Cancelled" || `${a.date}T${a.time}` < now,
      ),
    }
  }, [appointments])

  return (
    <div className="flex flex-col gap-6">
      {/* Book form */}
      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <CalendarPlus className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Schedule Appointment
          </h2>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Patient — pick from real DB list */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="patientSelect">Patient</Label>
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
              >
                <SelectTrigger id="patientSelect">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {(patients as any[]).map((p: any) => (
                    <SelectItem key={p.patientId} value={p.patientId}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Fallback manual entry if patient not in DB */}
              {!selectedPatientId && (
                <Input
                  name="patientName"
                  placeholder="Or type name manually"
                  className="mt-1"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apptType">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="apptType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select value={doctor} onValueChange={setDoctor}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Assign doctor" />
                </SelectTrigger>
                <SelectContent>
                  {DOCTORS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input id="notes" name="notes" placeholder="E.g. fasting required" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  <CalendarPlus className="size-4" />
                  Book Appointment
                </>
              )}
            </Button>
            {feedback && (
              <p className={cn("text-sm font-medium", feedback.ok ? "text-primary" : "text-destructive")}>
                {feedback.msg}
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* Upcoming */}
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Upcoming</h2>
          </div>
          <span className="text-sm text-muted-foreground">{upcoming.length} scheduled</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading…
          </div>
        ) : upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <CalendarDays className="size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((appt) => (
              <AppointmentRow
                key={appt.appointmentId}
                appt={appt}
                isCancelling={cancelling === appt.appointmentId}
                onCancel={() => handleCancel(appt)}
              />
            ))}
          </ul>
        )}
      </Card>

      {/* Past / Cancelled */}
      {past.length > 0 && (
        <Card className="p-0">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <Clock className="size-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-semibold text-foreground">Past & Cancelled</h2>
          </div>
          <ul className="divide-y divide-border opacity-70">
            {past.map((appt) => (
              <AppointmentRow key={appt.appointmentId} appt={appt} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

function AppointmentRow({
  appt,
  isCancelling,
  onCancel,
}: {
  appt: Appointment
  isCancelling?: boolean
  onCancel?: () => void
}) {
  const typeStyle = TYPE_STYLES[appt.type] ?? TYPE_STYLES.default
  const statusStyle = STATUS_STYLES[appt.status] ?? STATUS_STYLES.Scheduled

  return (
    <li className="flex items-center gap-4 px-6 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Clock className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{appt.patientName}</p>
          {appt.doctor && appt.doctor !== "Unassigned" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="size-3" />
              {appt.doctor}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {formatDateTime(appt.date, appt.time)}
          </span>
          {appt.notes && (
            <span className="flex items-center gap-1">
              <StickyNote className="size-3.5" />
              {appt.notes}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("text-xs", typeStyle)}>
          <Stethoscope className="mr-1 size-3" />
          {appt.type}
        </Badge>
        <Badge className={cn("text-xs", statusStyle)}>{appt.status}</Badge>
        {onCancel && appt.status === "Scheduled" && (
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="ml-1 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Cancel appointment"
          >
            {isCancelling ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </button>
        )}
      </div>
    </li>
  )
}
