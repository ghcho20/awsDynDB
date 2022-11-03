import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ddbDocClient.js";
import { TABLE_NAME } from "./env.js";

// Provided a GSI, 'year-title-index' on {PK:year, SK:title}
export const queryByYear = async (year) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "year-title-index",
    ExpressionAttributeNames: { "#y": "year" },
    ProjectionExpression: "#y, title, info",
    ExpressionAttributeValues: {
      ":y": year,
    },
    KeyConditionExpression: "#y = :y",
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    console.log(`Total ${data.Items.length} items returned`);
  } catch (err) {
    console.log("Error", err);
  }
};

queryByYear(2014);
