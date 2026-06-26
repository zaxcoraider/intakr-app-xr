"use server"

import { PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/aws"
import { revalidatePath } from "next/cache"

const TABLE = "intakr-settings"

// Settings are stored as flat key-value pairs.
// settingKey (HASH) + settingValue (RANGE)

export async function saveSetting(key: string, value: string) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: { settingKey: key, settingValue: value },
    }),
  )
  revalidatePath("/settings")
}

export async function saveSettings(settings: Record<string, string>) {
  try {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        docClient.send(
          new PutCommand({
            TableName: TABLE,
            Item: { settingKey: key, settingValue: value },
          }),
        ),
      ),
    )
    revalidatePath("/settings")
    return { success: true, message: "Settings saved successfully." }
  } catch (error) {
    console.error("[v0] saveSettings error:", error)
    const msg = error instanceof Error ? error.message : String(error)
    return { success: false, message: `Failed to save settings: ${msg}` }
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: TABLE }))
    const result: Record<string, string> = {}
    for (const item of data.Items || []) {
      result[item.settingKey] = item.settingValue
    }
    return result
  } catch (error) {
    console.error("[v0] getSettings error:", error)
    return {}
  }
}
