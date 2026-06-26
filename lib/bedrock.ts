import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"

export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.DYNAMODB_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID!,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY!,
  },
})

export async function generateIntakeSummary(patient: {
  name: string
  insuranceProvider: string
  policyNumber: string
  phone: string
  email: string
}): Promise<string> {
  const prompt = `You are a clinical intake assistant for Intakr, a healthcare clinic management system.

A new patient has just been registered. Write a concise 2-sentence clinical intake summary for the clinic staff. Be professional, factual, and use the data provided. Do not invent any medical details.

Patient details:
- Name: ${patient.name}
- Insurance Provider: ${patient.insuranceProvider || "Not provided"}
- Policy Number: ${patient.policyNumber || "Not provided"}
- Phone: ${patient.phone}
- Email: ${patient.email}
- Status: Pending Insurance Verification

Write only the summary, nothing else.`

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  }

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  })

  const response = await bedrockClient.send(command)
  const result = JSON.parse(new TextDecoder().decode(response.body))
  return result.content?.[0]?.text ?? ""
}
