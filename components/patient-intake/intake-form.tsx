"use client";

import { createPatient } from "@/app/actions/patientActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function PatientIntakeForm() {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">New Patient Intake</h2>

      <form action={async (formData) => {
        const result = await createPatient(formData);
        setStatus(result.message);
        if (result.success) {
          // Optional: Reset form or redirect
        }
      }} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" required placeholder="(555) 123-4567" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Select name="insuranceProvider" required>
              <SelectTrigger>
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

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
          Submit Intake
        </Button>

        {status && (
          <p className={`text-center mt-4 ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
