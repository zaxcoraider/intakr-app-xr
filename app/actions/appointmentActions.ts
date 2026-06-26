"use server"

import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/aws"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

const TABLE = "intakr-appointments"

export type Appointment = {
  appointmentId: string
  date: string
  time: string
  patientName: string
  patientId?: string
  doctor: string
  type: string
  status: string
  notes?: string
}

export async function createAppointment(formData: FormData) {
  const patientName = formData.get("patientName") as string
  const patientId = formData.get("patientId") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const type = formData.get("type") as string
  const doctor = formData.get("doctor") as string
  const notes = formData.get("notes") as string

  if (!patientName || !date || !time || !type) {
    return { success: false, message: "Missing required fields." }
  }

  const item: Appointment = {
    appointmentId: uuidv4(),
    date,
    time,
    patientName,
    patientId: patientId || undefined,
    doctor: doctor || "Unassigned",
    type,
    status: "Scheduled",
    notes: notes || undefined,
  }

  try {
    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }))
    revalidatePath("/appointments")
    revalidatePath("/")
    return { success: true, message: `Appointment for ${patientName} booked successfully.` }
  } catch (error) {
    console.error("[v0] createAppointment error:", error)
    const msg = error instanceof Error ? error.message : String(error)
    return { success: false, message: `Failed to book appointment: ${msg}` }
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE }))
    const items = (data.Items || []) as Appointment[]
    return items.sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    )
  } catch (error) {
    console.error("[v0] getAppointments error:", error)
    return []
  }
}

export async function cancelAppointment(appointmentId: string, date: string) {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { appointmentId, date },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "Cancelled" },
      }),
    )
    revalidatePath("/appointments")
    return { success: true }
  } catch (error) {
    console.error("[v0] cancelAppointment error:", error)
    return { success: false }
  }
}
