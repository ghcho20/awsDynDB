import { ddbDocClient } from "./ddbDocClient.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "./env.js";

// Scan by a nested attr (info.actors)
// Scanning a nexted attr does not work with DynamoDB console
export const scanByActor = async (actor) => {
  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "title, info.actors",
    FilterExpression: "contains (info.actors, :a)",
    ExpressionAttributeValues: {
      ":a": actor,
    },
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Total ${data.Items.length} items returned`);
    for (const item of data.Items) console.log(item.info.actors);
  } catch (err) {
    console.log("Error", err);
  }
};

scanByActor("Keanu Reeves");
