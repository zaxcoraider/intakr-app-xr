"use server";

import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";
import { v4 as uuidv4 } from "uuid";

export async function createAppointment(formData: FormData) {
  const patientName = formData.get("patientName") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const type = formData.get("type") as string;

  const appointmentId = uuidv4();

  const params = {
    TableName: "intakr-appointments",
    Item: {
      appointmentId,
      date, // Format: YYYY-MM-DD
      time,
      patientName,
      type,
      status: "Scheduled",
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getAppointments() {
  const params = {
    TableName: "intakr-appointments",
  };

  try {
    const data = await docClient.send(new ScanCommand(params));
    return data.Items || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
