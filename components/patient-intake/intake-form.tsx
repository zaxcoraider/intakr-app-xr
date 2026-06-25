"use client"

import { useState, useTransition } from "react"
import { CheckCircle2, AlertCircle, UserPlus, Loader2 } from "lucide-react"
import { createPatient } from "@/app/actions/patientActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const INSURANCE_PROVIDERS = ["BlueCross", "Aetna", "Cigna", "UnitedHealth"]

type FormStatus = { type: "success" | "error"; message: string } | null

export function IntakeForm() {
  const [provider, setProvider] = useState("")
  const [status, setStatus] = useState<FormStatus>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await createPatient(formData)
      setStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      })
      if (result.success) {
        form.reset()
        setProvider("")
      }
    })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-heading text-xl">Patient Information</CardTitle>
        <CardDescription>
          Enter the patient&apos;s details to begin the intake and verification process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                autoComplete="tel"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Select value={provider} onValueChange={setProvider} required>
                <SelectTrigger id="insuranceProvider" className="w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_PROVIDERS.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Hidden input to submit the Radix Select value with the form */}
              <input type="hidden" name="insuranceProvider" value={provider} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                name="policyNumber"
                placeholder="XYZ-00112233"
                required
              />
            </div>
          </div>

          {status && (
            <div
              role="status"
              className={
                status.type === "success"
                  ? "flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground"
                  : "flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
              }
            >
              {status.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              {status.message}
            </div>
          )}

          <div className="flex justify-end border-t border-border pt-2">
            <Button type="submit" size="lg" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {isPending ? "Submitting..." : "Submit Intake"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
