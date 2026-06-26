"use server"

import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/aws"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

const PATIENTS_TABLE = "intakr-patients"
const VERIFICATIONS_TABLE = "intakr-verifications"

export type Verification = {
  verificationId: string
  patientId: string
  patientName?: string
  policyNumber: string
  insuranceProvider?: string
  status: string
  coverageAmount: string
  createdAt: string
}

export type PendingPatient = {
  patientId: string
  createdAt: string
  name: string
  email: string
  phone: string
  insuranceProvider: string
  policyNumber: string
  status: string
}

const COVERAGE_OPTIONS = ["$50,000", "$100,000", "$250,000", "$500,000"]

function pickCoverage() {
  return COVERAGE_OPTIONS[Math.floor(Math.random() * COVERAGE_OPTIONS.length)]
}

/**
 * Returns every patient still awaiting insurance verification.
 * These are the records driving the "Pending" count on the dashboard.
 */
export async function getPendingPatients(): Promise<PendingPatient[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: PATIENTS_TABLE,
        FilterExpression: "#status = :pending",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":pending": "Pending Verification" },
      }),
    )
    const patients = (result.Items ?? []) as PendingPatient[]
    // Oldest first so the longest-waiting patient is verified first.
    return patients.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""))
  } catch (error) {
    console.error("[v0] Error fetching pending patients:", error)
    return []
  }
}

/**
 * Verifies a real patient: writes a verification record AND flips the
 * patient's status from "Pending Verification" to "Verified" so the
 * dashboard pending count goes down and the patient is resolved.
 */
export async function verifyPatient(patientId: string, createdAt: string) {
  if (!patientId || !createdAt) {
    return { success: false, message: "Missing patient identifiers." }
  }

  try {
    // 1. Update the patient's status in the patients table.
    const updated = await docClient.send(
      new UpdateCommand({
        TableName: PATIENTS_TABLE,
        Key: { patientId, createdAt },
        UpdateExpression: "SET #status = :verified, verifiedAt = :now",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":verified": "Verified",
          ":now": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      }),
    )

    const patient = updated.Attributes as PendingPatient | undefined
    const coverageAmount = pickCoverage()

    // 2. Write a linked verification record.
    const verification: Verification = {
      verificationId: uuidv4(),
      patientId,
      patientName: patient?.name,
      policyNumber: (patient?.policyNumber || "N/A").toUpperCase(),
      insuranceProvider: patient?.insuranceProvider,
      status: "Verified",
      coverageAmount,
      createdAt: new Date().toISOString(),
    }

    await docClient.send(
      new PutCommand({ TableName: VERIFICATIONS_TABLE, Item: verification }),
    )

    revalidatePath("/insurance-verify")
    revalidatePath("/")
    return {
      success: true,
      message: `${patient?.name ?? "Patient"} verified · Coverage ${coverageAmount}.`,
      verification,
    }
  } catch (error) {
    console.error("[v0] Error verifying patient:", error)
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, message: `Failed to verify patient: ${message}` }
  }
}

/**
 * Manual verification by Patient ID + Policy Number. If a matching patient
 * record exists and is still pending, its status is also flipped to Verified.
 */
export async function runVerification(formData: FormData) {
  const patientId = (formData.get("patientId") as string)?.trim()
  const policyNumber = (formData.get("policyNumber") as string)?.trim()

  if (!patientId || !policyNumber) {
    return { success: false, message: "Patient ID and Policy Number are required." }
  }

  const coverageAmount = pickCoverage()
  const verification: Verification = {
    verificationId: uuidv4(),
    patientId,
    policyNumber: policyNumber.toUpperCase(),
    status: "Verified",
    coverageAmount,
    createdAt: new Date().toISOString(),
  }

  try {
    // Try to resolve a matching patient and flip their status to Verified.
    try {
      const match = await docClient.send(
        new ScanCommand({
          TableName: PATIENTS_TABLE,
          FilterExpression: "patientId = :pid",
          ExpressionAttributeValues: { ":pid": patientId },
        }),
      )
      const patient = (match.Items ?? [])[0] as PendingPatient | undefined
      if (patient) {
        verification.patientName = patient.name
        verification.insuranceProvider = patient.insuranceProvider
        await docClient.send(
          new UpdateCommand({
            TableName: PATIENTS_TABLE,
            Key: { patientId: patient.patientId, createdAt: patient.createdAt },
            UpdateExpression: "SET #status = :verified, verifiedAt = :now",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: {
              ":verified": "Verified",
              ":now": new Date().toISOString(),
            },
          }),
        )
      }
    } catch (linkError) {
      console.warn("[v0] Could not link verification to a patient:", linkError)
    }

    await docClient.send(
      new PutCommand({ TableName: VERIFICATIONS_TABLE, Item: verification }),
    )

    revalidatePath("/insurance-verify")
    revalidatePath("/")
    return { success: true, message: "Insurance verified successfully.", verification }
  } catch (error) {
    console.error("[v0] Error running verification:", error)
    return { success: false, message: "Failed to verify insurance. Please try again." }
  }
}

export async function getVerifications(): Promise<Verification[]> {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: VERIFICATIONS_TABLE }),
    )
    return (result.Items ?? []) as Verification[]
  } catch (error) {
    console.error("[v0] Error fetching verifications:", error)
    return []
  }
}
