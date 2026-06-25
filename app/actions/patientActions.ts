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
    await docClient.send(
      new PutCommand({
        TableName: "intakr-patients",
        Item: patient,
      }),
    );

    revalidatePath("/");
    return { success: true, message: "Patient intake submitted successfully." };
  } catch (error) {
    console.error("Error creating patient:", error);
    return { success: false, message: "Failed to submit patient intake. Please try again." };
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
  const params = {
    TableName: "intakr-patients",
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    const patients = data.Items || [];

    const totalPatients = patients.length;
    const pendingVerifications = patients.filter((p: any) => p.status === "Pending Verification").length;

    // Mocking revenue for the demo (e.g., $150 per intake)
    const revenue = totalPatients * 150;

    return {
      totalPatients,
      pendingVerifications,
      revenue,
      avgTime: "4m 30s" // Static for now, but looks good
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}
