"use server";

import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
  const patient = {
    id: uuidv4(),
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    insuranceProvider: formData.get("insuranceProvider") as string,
    policyNumber: formData.get("policyNumber") as string,
    status: "Pending Verification",
    createdAt: new Date().toISOString(),
  };

  try {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn("[v0] AWS credentials not configured. Using mock mode.");
      // Mock successful response for testing without AWS
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: `Patient ${patient.name} intake submitted successfully (mock mode).`,
      };
    }

    await docClient.send(
      new PutCommand({
        TableName: "intakr-patients",
        Item: patient,
      }),
    );

    revalidatePath("/");
    return { success: true, message: "Patient intake submitted successfully." };
  } catch (error) {
    console.error("[v0] Error creating patient:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to submit patient intake. ${errorMessage.substring(0, 50)}...`,
    };
  }
}

export async function verifyInsurance(patientId: string) {
  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: "intakr-patients",
        Key: { id: patientId },
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
    console.error("Error verifying insurance:", error);
    return { success: false, message: "Failed to verify insurance. Please try again." };
  }
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Fetch all patients
    const patientsData = await docClient.send(
      new ScanCommand({
        TableName: "intakr-patients",
      }),
    );
    const patients = patientsData.Items || [];

    // Filter for TODAY only
    const todaysPatients = patients.filter((p: any) => p.createdAt.startsWith(today));

    // Fetch verifications to check pending status
    const verData = await docClient.send(
      new ScanCommand({
        TableName: "intakr-verifications",
      }),
    );
    const verifications = verData.Items || [];
    const pendingCount = verifications.filter((v: any) => v.status === "Pending").length;

    // Calculate Real Metrics
    const totalPatientsToday = todaysPatients.length;
    const revenue = totalPatientsToday * 150; // $150 per intake

    return {
      totalPatientsToday,
      pendingVerifications: pendingCount,
      revenue,
      avgTime: "4m 30s", // Keep static for now, or calculate if you have timestamp data
      recentActivity: patients.slice(-5).reverse(), // Get last 5 patients for the feed
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}
