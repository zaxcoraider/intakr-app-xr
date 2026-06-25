"use server";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/aws";

export async function saveSetting(key: string, value: string) {
  await docClient.send(new PutCommand({
    TableName: "intakr-settings",
    Item: { settingKey: key, settingValue: value }
  }));
}

export async function getSettings() {
  const data = await docClient.send(new ScanCommand({ TableName: "intakr-settings" }));
  return data.Items || [];
}
