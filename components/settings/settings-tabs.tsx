"use client"

import { useState, useTransition } from "react"
import useSWR from "swr"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Check,
  Loader2,
  Users,
  UserPlus,
  MoreHorizontal,
  CreditCard,
  Shield,
} from "lucide-react"
import { getSettings, saveSettings } from "@/app/actions/settingsActions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .replace(/Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

// ─── Shared save hook ────────────────────────────────────────────────────────
function useSaveSettings() {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  function save(values: Record<string, string>, onSuccess?: () => void) {
    startTransition(async () => {
      const result = await saveSettings(values)
      setFeedback({ ok: result.success, msg: result.message ?? "" })
      if (result.success) onSuccess?.()
    })
  }

  return { isPending, feedback, setFeedback, save }
}

// ─── Save button row ─────────────────────────────────────────────────────────
function SaveRow({
  isPending,
  feedback,
}: {
  isPending: boolean
  feedback: { ok: boolean; msg: string } | null
}) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
      {feedback ? (
        <p
          className={cn(
            "text-sm font-medium",
            feedback.ok ? "text-accent-foreground" : "text-destructive",
          )}
        >
          {feedback.ok && <Check className="mr-1 inline size-3.5" />}
          {feedback.msg}
        </p>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  )
}

// ─── General tab ─────────────────────────────────────────────────────────────
function GeneralTab({ settings }: { settings: Record<string, string> }) {
  const { isPending, feedback, save } = useSaveSettings()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    save({
      clinicName: fd.get("clinicName") as string,
      adminEmail: fd.get("adminEmail") as string,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">General Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your clinic name and primary admin contact, stored in DynamoDB.
      </p>
      <form
        key={`general-${settings.clinicName}-${settings.adminEmail}`}
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="clinicName">Clinic Name</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="clinicName"
              name="clinicName"
              className="pl-9"
              placeholder="Intakr Family Health"
              defaultValue={settings.clinicName ?? ""}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="adminEmail">Admin Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="adminEmail"
              name="adminEmail"
              type="email"
              className="pl-9"
              placeholder="admin@clinic.health"
              defaultValue={settings.adminEmail ?? ""}
              required
            />
          </div>
        </div>
        <SaveRow isPending={isPending} feedback={feedback} />
      </form>
    </Card>
  )
}

// ─── Clinic Profile tab ───────────────────────────────────────────────────────
function ClinicProfileTab({ settings }: { settings: Record<string, string> }) {
  const { isPending, feedback, save } = useSaveSettings()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    save({
      clinicFullName: fd.get("clinicFullName") as string,
      clinicAddress: fd.get("clinicAddress") as string,
      clinicNPI: fd.get("clinicNPI") as string,
      clinicPhone: fd.get("clinicPhone") as string,
      clinicWebsite: fd.get("clinicWebsite") as string,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Clinic Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Public-facing clinic details stored in DynamoDB.
      </p>
      <form
        key={`profile-${settings.clinicFullName}-${settings.clinicAddress}`}
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="clinicFullName">Clinic Full Name</Label>
          <Input
            id="clinicFullName"
            name="clinicFullName"
            placeholder="Intakr Family Health Center"
            defaultValue={settings.clinicFullName ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="clinicAddress">Address</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="clinicAddress"
              name="clinicAddress"
              className="pl-9"
              placeholder="240 Wellness Ave, Suite 100"
              defaultValue={settings.clinicAddress ?? ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="clinicNPI">NPI Number</Label>
          <div className="relative">
            <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="clinicNPI"
              name="clinicNPI"
              className="pl-9"
              placeholder="1234567890"
              defaultValue={settings.clinicNPI ?? ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="clinicPhone">Phone</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="clinicPhone"
              name="clinicPhone"
              className="pl-9"
              placeholder="(512) 555-0142"
              defaultValue={settings.clinicPhone ?? ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <SaveRow isPending={isPending} feedback={feedback} />
        </div>
      </form>
    </Card>
  )
}

// ─── Team Members tab (UI only — no user auth yet) ────────────────────────────
function TeamTab({ settings }: { settings: Record<string, string> }) {
  const { isPending, feedback, save } = useSaveSettings()
  const storedCount = parseInt(settings.teamMemberCount ?? "0", 10)

  function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get("memberName") as string
    const role = fd.get("memberRole") as string
    const email = fd.get("memberEmail") as string
    save({
      [`team_${Date.now()}_name`]: name,
      [`team_${Date.now()}_role`]: role,
      [`team_${Date.now()}_email`]: email,
      teamMemberCount: String(storedCount + 1),
    })
  }

  const teamEntries = Object.entries(settings)
    .filter(([k]) => k.startsWith("team_") && k.endsWith("_name"))
    .map(([k, name]) => {
      const ts = k.split("_")[1]
      return {
        ts,
        name,
        role: settings[`team_${ts}_role`] ?? "Staff",
        email: settings[`team_${ts}_email`] ?? "",
      }
    })

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">Team Members</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Staff saved in DynamoDB — {teamEntries.length} member{teamEntries.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Invite form */}
        <form onSubmit={handleInvite} className="border-b border-border px-6 py-5">
          <p className="mb-3 text-sm font-medium text-foreground">Add team member</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="memberName">Full Name</Label>
              <Input id="memberName" name="memberName" placeholder="Dr. Jane Smith" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="memberEmail">Email</Label>
              <Input id="memberEmail" name="memberEmail" type="email" placeholder="jane@clinic.health" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="memberRole">Role</Label>
              <Input id="memberRole" name="memberRole" placeholder="Physician, Front Desk…" required />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              Add Member
            </Button>
            {feedback && (
              <p className={cn("text-sm font-medium", feedback.ok ? "text-accent-foreground" : "text-destructive")}>
                {feedback.msg}
              </p>
            )}
          </div>
        </form>

        {teamEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
            <Users className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No team members added yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {teamEntries.map((m) => (
              <li key={m.ts} className="flex items-center gap-4 px-6 py-4">
                <Avatar className="size-10">
                  <AvatarFallback>{initials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <Badge variant="secondary">{m.role}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

// ─── Billing tab ──────────────────────────────────────────────────────────────
function BillingTab({ settings }: { settings: Record<string, string> }) {
  const { isPending, feedback, save } = useSaveSettings()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    save({
      billingPlan: fd.get("billingPlan") as string,
      billingEmail: fd.get("billingEmail") as string,
      billingTaxId: fd.get("billingTaxId") as string,
    })
  }

  return (
    <Card className="p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Billing</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Billing preferences stored in DynamoDB.
      </p>

      {/* Plan badge */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {settings.billingPlan || "Professional Plan"}
            </p>
            <p className="text-xs text-muted-foreground">Billed annually</p>
          </div>
        </div>
        <Badge className="border-transparent bg-accent text-accent-foreground">Active</Badge>
      </div>

      <form
        key={`billing-${settings.billingPlan}-${settings.billingEmail}`}
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="billingPlan">Plan Name</Label>
          <Input
            id="billingPlan"
            name="billingPlan"
            placeholder="Professional Plan"
            defaultValue={settings.billingPlan ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="billingEmail">Billing Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="billingEmail"
              name="billingEmail"
              type="email"
              className="pl-9"
              placeholder="billing@clinic.health"
              defaultValue={settings.billingEmail ?? ""}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="billingTaxId">Tax ID / EIN</Label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="billingTaxId"
              name="billingTaxId"
              className="pl-9"
              placeholder="XX-XXXXXXX"
              defaultValue={settings.billingTaxId ?? ""}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <SaveRow isPending={isPending} feedback={feedback} />
        </div>
      </form>
    </Card>
  )
}

// ─── Root tabs component ──────────────────────────────────────────────────────
export function SettingsTabs() {
  const { data: settings = {}, mutate } = useSWR<Record<string, string>>(
    "settings-all",
    getSettings,
    { refreshInterval: 0 },
  )

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="profile">Clinic Profile</TabsTrigger>
        <TabsTrigger value="team">Team Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <GeneralTab settings={settings} />
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <ClinicProfileTab settings={settings} />
      </TabsContent>

      <TabsContent value="team" className="mt-6">
        <TeamTab settings={settings} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingTab settings={settings} />
      </TabsContent>
    </Tabs>
  )
}
