import { ddbDocClient } from "./ddbDocClient.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "./env.js";

const mostPopularGenre = (items) => {
  let map = {};
  for (const item of items) {
    for (const genre of item.info.genres) {
      if (map[genre]) {
        map[genre]++;
      } else {
        map[genre] = 1;
      }
    }
  }

  let topGenre;
  let topCast = -Infinity;
  for (const [genre, nCast] of Object.entries(map)) {
    if (nCast > topCast) {
      topGenre = genre;
      topCast = nCast;
    }
  }

  return [topGenre, topCast];
};

// Scan by a nested attr (info.actors)
// Scanning a nexted attr does not work with DynamoDB console
export const scanByActor = async (actor) => {
  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "title, info.genres",
    FilterExpression: "contains (info.actors, :a)",
    ExpressionAttributeValues: {
      ":a": actor,
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

const popularGenreByActor = async () => {
  const items = await scanByActor("Keanu Reeves");
  const [topGenre, nCast] = mostPopularGenre(items);
  console.log(topGenre, nCast);
};

popularGenreByActor();
