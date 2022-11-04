import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ddbDocClient.js";
import { TABLE_NAME } from "./env.js";
import { Heap } from "heap-js";

const topkSort = (items, K, comp) => {
  const minHeap = new Heap(comp);
  let topk = [];
  if (items.length > K) {
    for (const item of items) {
      if (minHeap.size() == K) {
        if (comp(minHeap.peek(), item) < 0) {
          minHeap.replace(item);
        }
      } else {
        minHeap.push(item);
      }
    }
    topk = minHeap.toArray();
  } else {
    topk = items;
  }

  topk.sort((a, b) => -1 * comp(a, b));
  return topk;
};

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
    console.log(
      `Total ${data.Items.length} items returned --------------------`,
    );
    return data.Items;
  } catch (err) {
    console.log("Error", err);
  }
};

const queryByYearAndSort = async () => {
  const items = await queryByYear(2014);
  const topk = topkSort(items, 10, (a, b) =>
    a.info.rank < b.info.rank ? -1 : 1,
  );

  for (const mov of topk) {
    console.log(`"${mov.title}"@${mov.year} ranked ${mov.info.rank}`);
  }
};

queryByYearAndSort();
