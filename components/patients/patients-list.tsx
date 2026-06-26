"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { getPatients } from "@/app/actions/patientActions"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Patient = {
  patientId: string
  createdAt: string
  name: string
  email: string
  phone: string
  insuranceProvider?: string
  policyNumber?: string
  status: string
  verifiedAt?: string
}

const STATUS_STYLES: Record<string, string> = {
  Verified: "bg-accent text-accent-foreground border-transparent",
  "Pending Verification": "bg-orange-100 text-orange-700 border-transparent dark:bg-orange-900/30 dark:text-orange-400",
  Rejected: "bg-destructive/10 text-destructive border-transparent",
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  Verified: <CheckCircle2 className="size-3.5" />,
  "Pending Verification": <Clock className="size-3.5" />,
  Rejected: <AlertCircle className="size-3.5" />,
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface PatientsListProps {
  initialPatients: any[]
}

export function PatientsList({ initialPatients }: PatientsListProps) {
  const { data: patients = initialPatients } = useSWR<Patient[]>(
    "patients-list",
    () => getPatients() as Promise<Patient[]>,
    { fallbackData: initialPatients, refreshInterval: 30000 },
  )

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        (p.insuranceProvider || "").toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [patients, search, statusFilter])

  const counts = useMemo(() => ({
    total: patients.length,
    verified: patients.filter((p) => p.status === "Verified").length,
    pending: patients.filter((p) => p.status === "Pending Verification").length,
  }), [patients])

  return (
    <div className="flex flex-col gap-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: counts.total, icon: <Users className="size-4" /> },
          { label: "Verified", value: counts.verified, icon: <CheckCircle2 className="size-4 text-accent-foreground" /> },
          { label: "Pending", value: counts.pending, icon: <Clock className="size-4 text-orange-500" /> },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              {stat.icon}
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card className="p-0">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or provider…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Pending Verification">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            <Button
              nativeButton={false}
              render={<Link href="/patient-intake" />}
              className="gap-2"
            >
              <UserPlus className="size-4" />
              New Patient
            </Button>
          </div>
        </div>

        {/* Header row */}
        <div className="hidden grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr] gap-4 border-b border-border bg-secondary/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
          <span>Patient</span>
          <span>Contact</span>
          <span>Insurance</span>
          <span>Registered</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <Users className="size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No patients found</p>
            <p className="text-xs text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Register your first patient using the form above."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((patient) => (
              <li
                key={`${patient.patientId}-${patient.createdAt}`}
                className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-muted/40 sm:grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr] sm:items-center sm:gap-4"
              >
                {/* Name + initials */}
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {initials(patient.name)}
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">
                    {patient.name}
                  </span>
                </div>

                {/* Contact */}
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{patient.email}</p>
                  <p className="text-xs text-muted-foreground">{patient.phone}</p>
                </div>

                {/* Insurance */}
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    {patient.insuranceProvider || "—"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {patient.policyNumber || ""}
                  </p>
                </div>

                {/* Date */}
                <p className="text-sm text-muted-foreground">
                  {formatDate(patient.createdAt)}
                </p>

                {/* Status badge */}
                <Badge
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium",
                    STATUS_STYLES[patient.status] ?? "bg-secondary text-foreground border-transparent",
                  )}
                >
                  {STATUS_ICON[patient.status]}
                  {patient.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {patients.length} patients
          </div>
        )}
      </Card>
    </div>
  )
}
