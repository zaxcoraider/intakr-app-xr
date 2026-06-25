"use server"

import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/aws"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export type Verification = {
  verificationId: string
  patientId: string
  policyNumber: string
  status: string
  coverageAmount: string
  createdAt: string
}

export async function runVerification(formData: FormData) {
  const patientId = (formData.get("patientId") as string)?.trim()
  const policyNumber = (formData.get("policyNumber") as string)?.trim()

  if (!patientId || !policyNumber) {
    return { success: false, message: "Patient ID and Policy Number are required." }
  }

  // Placeholder: simulated payer response. Replace with a real clearinghouse call.
  const coverageOptions = ["$50,000", "$100,000", "$250,000", "$500,000"]
  const verification: Verification = {
    verificationId: uuidv4(),
    patientId,
    policyNumber: policyNumber.toUpperCase(),
    status: "Verified",
    coverageAmount: coverageOptions[Math.floor(Math.random() * coverageOptions.length)],
    createdAt: new Date().toISOString(),
  }

  try {
    await docClient.send(
      new PutCommand({
        TableName: "intakr-verifications",
        Item: verification,
      }),
    )

    revalidatePath("/insurance-verify")
    return { success: true, message: "Insurance verified successfully.", verification }
  } catch (error) {
    console.error("Error running verification:", error)
    return { success: false, message: "Failed to verify insurance. Please try again." }
  }
}

export async function getVerifications(): Promise<Verification[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: "intakr-verifications" }),
    )
    return (result.Items ?? []) as Verification[]
  } catch (error) {
    console.error("Error fetching verifications:", error)
    return []
  }
}
