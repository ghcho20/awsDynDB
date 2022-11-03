import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { REGION } from "./env.js";

const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient };
