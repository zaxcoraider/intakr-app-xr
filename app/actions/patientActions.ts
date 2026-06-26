"use server";

import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

const PATIENTS_TABLE = "intakr-patients";
const VERIFICATIONS_TABLE = "intakr-verifications";

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email || !phone) {
    return {
      success: false,
      message: "Missing required fields: name, email, and phone are required.",
    };
  }

  // Table key schema: patientId (HASH) + createdAt (RANGE)
  const patient = {
    patientId: uuidv4(),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    insuranceProvider: (formData.get("insuranceProvider") as string) || "",
    policyNumber: (formData.get("policyNumber") as string) || "",
    status: "Pending Verification",
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: PATIENTS_TABLE,
        Item: patient,
      }),
    );

    revalidatePath("/");
    revalidatePath("/patient-intake");
    return {
      success: true,
      message: `Patient ${name} intake submitted successfully.`,
      patient,
    };
  } catch (error) {
    console.error("[v0] Error creating patient:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to submit patient intake: ${message}`,
    };
  }
}

export async function getPatients() {
  try {
    const data = await docClient.send(
      new ScanCommand({ TableName: PATIENTS_TABLE }),
    );
    const patients = data.Items || [];
    // Newest first
    return patients.sort((a: any, b: any) =>
      (b.createdAt || "").localeCompare(a.createdAt || ""),
    );
  } catch (error) {
    console.error("[v0] Error fetching patients:", error);
    return [];
  }
}

export async function verifyInsurance(patientId: string, createdAt: string) {
  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: PATIENTS_TABLE,
        Key: { patientId, createdAt },
        UpdateExpression: "SET #status = :status, verifiedAt = :verifiedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": "Verified",
          ":verifiedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      }),
    );

    revalidatePath("/");
    revalidatePath("/insurance-verify");
    return {
      success: true,
      message: "Insurance verified successfully.",
      patient: result.Attributes,
    };
  } catch (error) {
    console.error("[v0] Error verifying insurance:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Failed to verify insurance: ${message}` };
  }
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    const patientsData = await docClient.send(
      new ScanCommand({ TableName: PATIENTS_TABLE }),
    );
    const patients = patientsData.Items || [];

    const verData = await docClient.send(
      new ScanCommand({ TableName: VERIFICATIONS_TABLE }),
    );
    const verifications = verData.Items || [];

    const todaysPatients = patients.filter(
      (p: any) => p.createdAt && p.createdAt.startsWith(today),
    );

    // Pending = patients awaiting verification + any pending verification records
    const pendingFromPatients = patients.filter(
      (p: any) => p.status === "Pending Verification",
    ).length;
    const pendingFromVerifications = verifications.filter(
      (v: any) => v.status === "Pending",
    ).length;
    const pendingVerifications = pendingFromPatients + pendingFromVerifications;

    const totalPatientsToday = todaysPatients.length;
    const revenue = totalPatientsToday * 150; // $150 per intake

    // Build recent activity feed from newest patients
    const recentActivity = [...patients]
      .sort((a: any, b: any) =>
        (b.createdAt || "").localeCompare(a.createdAt || ""),
      )
      .slice(0, 5)
      .map((p: any) => ({
        id: p.patientId,
        name: p.name,
        detail: p.insuranceProvider
          ? `Intake · ${p.insuranceProvider}`
          : "New patient intake",
        status: p.status === "Verified" ? "Verified" : "Pending",
        time: formatRelativeTime(p.createdAt),
      }));

    return {
      totalPatientsToday,
      pendingVerifications,
      revenue,
      avgTime: "4m 30s",
      recentActivity,
    };
  } catch (error) {
    console.error("[v0] Error fetching stats:", error);
    return {
      totalPatientsToday: 0,
      pendingVerifications: 0,
      revenue: 0,
      avgTime: "—",
      recentActivity: [],
    };
  }
}

function formatRelativeTime(iso?: string) {
  if (!iso) return "Recently";
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
