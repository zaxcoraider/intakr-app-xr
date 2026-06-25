"use server";

import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";
import { v4 as uuidv4 } from "uuid";

export async function runVerification(patientId: string, policyNumber: string) {
  const verificationId = uuidv4();
  
  // Simulate a real API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const params = {
    TableName: "intakr-verifications",
    Item: {
      verificationId,
      patientId,
      policyNumber,
      status: "Verified",
      coverageAmount: Math.floor(Math.random() * 50000) + 10000, // Random realistic amount
      verifiedAt: new Date().toISOString(),
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return { success: true, coverage: params.Item.coverageAmount };
  } catch (error) {
    return { success: false };
  }
}

export async function getVerifications() {
  const params = { TableName: "intakr-verifications" };
  const data = await docClient.send(new ScanCommand(params));
  return data.Items || [];
}
