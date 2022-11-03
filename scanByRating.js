import { ddbDocClient } from "./ddbDocClient.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "./env.js";

// Scan by a nested attr (info.rating)
// Scanning a nexted attr does not work with DynamoDB console
export const scanByRating = async (rating) => {
  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "title, info.rating",
    FilterExpression: "info.rating > :r",
    ExpressionAttributeValues: {
      ":r": 5.5,
    },
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Total ${data.Items.length} items returned`);
  } catch (err) {
    console.log("Error", err);
  }
};

scanByRating(5.5);
