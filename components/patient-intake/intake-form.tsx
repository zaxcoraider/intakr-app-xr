"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { createPatient } from "@/app/actions/patientActions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type IntakeFormProps = {
  onSuccess?: () => void
}

export function IntakeForm({ onSuccess }: IntakeFormProps) {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Card className="max-w-2xl p-6 md:p-8">
      <form
        action={async (formData) => {
          setIsSubmitting(true)
          setStatus(null)
          const result = await createPatient(formData)
          setStatus(result)
          setIsSubmitting(false)
          if (result.success) onSuccess?.()
        }}
        className="flex flex-col gap-5"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" required placeholder="(555) 123-4567" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Select name="insuranceProvider" required>
              <SelectTrigger id="insuranceProvider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BlueCross">BlueCross BlueShield</SelectItem>
                <SelectItem value="Aetna">Aetna</SelectItem>
                <SelectItem value="Cigna">Cigna</SelectItem>
                <SelectItem value="UnitedHealth">UnitedHealthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input id="policyNumber" name="policyNumber" required placeholder="XYZ-123456" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full gap-2">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Submitting…" : "Submit Intake"}
        </Button>

        {status && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium",
              status.success
                ? "bg-accent text-accent-foreground"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {status.success ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            {status.message}
          </div>
        )}
      </form>
    </Card>
  )
}

export default IntakeForm
