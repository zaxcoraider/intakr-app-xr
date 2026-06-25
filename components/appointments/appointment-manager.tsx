"use client"

import { useRef, useState, useTransition } from "react"
import useSWR from "swr"
import { CalendarPlus, Clock, CalendarDays, Stethoscope, Loader2 } from "lucide-react"
import { createAppointment, getAppointments } from "@/app/actions/appointmentActions"
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

type Appointment = {
  appointmentId: string
  patientName: string
  date: string
  time: string
  type: string
  status?: string
}

const APPOINTMENT_TYPES = ["Check-up", "Follow-up", "Emergency"]

function formatDateTime(date: string, time: string) {
  if (!date) return time || ""
  const d = new Date(`${date}T${time || "00:00"}`)
  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim()
  const datePart = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const timePart = time
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : ""
  return timePart ? `${datePart} · ${timePart}` : datePart
}

function typeStyles(type: string) {
  switch (type) {
    case "Emergency":
      return "border-orange-200 bg-orange-100 text-orange-700"
    case "Follow-up":
      return "border-primary/20 bg-primary/10 text-primary"
    default:
      return "border-transparent bg-accent text-accent-foreground"
  }
}

export function AppointmentManager() {
  const { data: appointments = [], mutate, isLoading } = useSWR<Appointment[]>(
    "appointments",
    () => getAppointments() as Promise<Appointment[]>,
  )

  const [type, setType] = useState("")
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("type", type)

    startTransition(async () => {
      const result = await createAppointment(formData)
      if (result.success) {
        setFeedback({ ok: true, msg: "Appointment booked successfully." })
        formRef.current?.reset()
        setType("")
        mutate()
      } else {
        setFeedback({ ok: false, msg: "Could not book appointment. Please try again." })
      }
    })
  }

  const sorted = [...appointments].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Schedule New Appointment */}
      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <CalendarPlus className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Schedule New Appointment
          </h2>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2 lg:col-span-1">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                placeholder="Jane Doe"
                required
              />
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
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarPlus className="size-4" />
                  Book Now
                </>
              )}
            </Button>
            {feedback && (
              <p
                className={
                  feedback.ok
                    ? "text-sm font-medium text-primary"
                    : "text-sm font-medium text-destructive"
                }
              >
                {feedback.msg}
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Upcoming Appointments
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {sorted.length} scheduled
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading appointments...
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <CalendarDays className="size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No appointments yet</p>
            <p className="text-sm text-muted-foreground">
              Book your first appointment using the form above.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((appt) => (
              <li
                key={appt.appointmentId}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Clock className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {appt.patientName}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatDateTime(appt.date, appt.time)}
                  </p>
                </div>
                <Badge variant="outline" className={typeStyles(appt.type)}>
                  <Stethoscope className="mr-1 size-3" />
                  {appt.type}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
