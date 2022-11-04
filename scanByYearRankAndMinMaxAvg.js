import { ddbDocClient } from "./ddbDocClient.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "./env.js";

const minMaxAvg = (items) => {
  let min = Infinity;
  let max = -Infinity;
  let total = 0;
  for (const item of items) {
    if (item.info.running_time_secs < min) {
      min = item.info.running_time_secs;
    }
    if (item.info.running_time_secs > max) {
      max = item.info.running_time_secs;
    }
    total += item.info.running_time_secs;
  }

  return [min, max, total / items.length];
};

// Scan by a nested attr (info.actors)
// Scanning a nexted attr does not work with DynamoDB console
export const scanByYearRank = async (year, rank) => {
  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "title, info.running_time_secs",
    FilterExpression:
      "#y = :y and info.#r > :r and attribute_exists(info.running_time_secs)",
    ExpressionAttributeNames: { "#y": "year", "#r": "rank" },
    ExpressionAttributeValues: {
      ":y": year,
      ":r": rank,
    },
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Total ${data.Items.length} items returned`);
    return data.Items;
  } catch (err) {
    console.log("Error", err);
  }
};

const minMaxAvgOfRunningTime = async () => {
  const items = await scanByYearRank(2014, 7);
  const [vMin, vMax, vAvg] = minMaxAvg(items);
  console.log(vMin, vMax, vAvg);
};

minMaxAvgOfRunningTime();
