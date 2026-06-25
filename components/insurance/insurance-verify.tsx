"use client"

import { useRef, useState, useTransition } from "react"
import useSWR from "swr"
import {
  ShieldCheck,
  Layers,
  Loader2,
  FileCheck,
  IdCard,
  Hash,
} from "lucide-react"
import { runVerification, getVerifications, type Verification } from "@/app/actions/insuranceActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function InsuranceVerify() {
  const { data: verifications = [], mutate, isLoading } = useSWR<Verification[]>(
    "verifications",
    () => getVerifications(),
  )

  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await runVerification(formData)
      if (result.success) {
        setFeedback({ ok: true, msg: result.message })
        formRef.current?.reset()
        mutate()
      } else {
        setFeedback({ ok: false, msg: result.message })
      }
    })
  }

  const sorted = [...verifications].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Verify form */}
      <Card className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Verify Insurance
          </h2>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="patientId"
                  name="patientId"
                  placeholder="e.g. PT-10293"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <div className="relative">
                <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  placeholder="e.g. BC-4471-22"
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  Verify Now
                </>
              )}
            </Button>
            <Button type="button" variant="outline" className="bg-transparent">
              <Layers className="size-4" />
              Run Batch Verification
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

      {/* Recent Verifications */}
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <FileCheck className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Recent Verifications
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">{sorted.length} total</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading verifications...
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <ShieldCheck className="size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">No verifications yet</p>
            <p className="text-sm text-muted-foreground">
              Run a verification using the form above to see results here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((v) => (
              <li key={v.verificationId} className="flex items-center gap-4 px-6 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Patient ID
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {v.patientId}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Policy
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {v.policyNumber}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Coverage
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {v.coverageAmount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="border-transparent bg-accent text-accent-foreground">
                    {v.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(v.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
