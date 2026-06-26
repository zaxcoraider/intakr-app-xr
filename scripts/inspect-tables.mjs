import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const tables = [
  "intakr-patients",
  "intakr-appointments",
  "intakr-settings",
  "intakr-verifications",
];

console.log("Region:", process.env.AWS_REGION);

for (const t of tables) {
  try {
    const r = await client.send(new DescribeTableCommand({ TableName: t }));
    const keys = r.Table.KeySchema.map(
      (k) => `${k.AttributeName} (${k.KeyType})`,
    ).join(", ");
    const attrs = r.Table.AttributeDefinitions.map(
      (a) => `${a.AttributeName}:${a.AttributeType}`,
    ).join(", ");
    console.log(`\n${t}:\n  KEYS = ${keys}\n  ATTRS = ${attrs}`);
  } catch (e) {
    console.log(`\n${t}: ERROR = ${e.name} - ${e.message}`);
  }
}
