"use server";

import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";
import { v4 as uuidv4 } from "uuid";

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const insuranceProvider = formData.get("insuranceProvider") as string;
  const policyNumber = formData.get("policyNumber") as string;

  const patientId = uuidv4();
  const createdAt = new Date().toISOString();

  const params = {
    TableName: "intakr-patients",
    Item: {
      patientId,
      createdAt,
      name,
      email,
      phone,
      insuranceProvider,
      policyNumber,
      status: "Pending Verification",
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return { success: true, message: "Patient added successfully!" };
  } catch (error) {
    console.error("Error adding patient:", error);
    return { success: false, message: "Failed to add patient." };
  }
}
