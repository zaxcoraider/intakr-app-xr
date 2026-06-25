"use client"

import { useState, useTransition } from "react"
import useSWR from "swr"
import { Building2, Mail, Check, Loader2 } from "lucide-react"
import { saveSetting, getSettings } from "@/app/actions/settingsActions"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function formatKey(key: string) {
  const labels: Record<string, string> = {
    clinicName: "Clinic Name",
    adminEmail: "Admin Email",
  }
  return labels[key] ?? key
}

export function SettingsGeneral() {
  const { data: settings, isLoading, mutate } = useSWR("settings", getSettings)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const clinicName = (formData.get("clinicName") as string)?.trim()
    const adminEmail = (formData.get("adminEmail") as string)?.trim()

    if (!clinicName || !adminEmail) {
      setFeedback({ ok: false, msg: "Clinic Name and Admin Email are required." })
      return
    }

    startTransition(async () => {
      try {
        await saveSetting("clinicName", clinicName)
        await saveSetting("adminEmail", adminEmail)
        setFeedback({ ok: true, msg: "Settings saved successfully." })
        await mutate()
      } catch {
        setFeedback({ ok: false, msg: "Failed to save settings. Please try again." })
      }
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Edit form */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">General Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your clinic name and primary admin contact.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              name="clinicName"
              placeholder="Intakr Family Health"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              name="adminEmail"
              type="email"
              placeholder="admin@intakr.health"
              required
            />
          </div>

          {feedback && (
            <p
              className={`text-sm ${feedback.ok ? "text-accent-foreground" : "text-destructive"}`}
              role="status"
            >
              {feedback.msg}
            </p>
          )}

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Current settings list */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Current Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Values currently stored in your clinic database.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading settings...
            </div>
          ) : !settings || settings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No settings saved yet.
            </div>
          ) : (
            settings.map((item: { settingKey: string; settingValue: string }) => (
              <div
                key={item.settingKey}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {item.settingKey === "adminEmail" ? (
                    <Mail className="size-4" />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatKey(item.settingKey)}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.settingValue}
                  </p>
                </div>
                <Check className="size-4 shrink-0 text-accent-foreground" />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
