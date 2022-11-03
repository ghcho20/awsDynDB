// moviedata.json
//
// [
//     {
//         "year": 2013,
//         "title": "Rush",
//         "info": {
//             "directors": ["Ron Howard"],
//             "release_date": "2013-09-02T00:00:00Z",
//             "rating": 8.3,
//             "genres": [
//                 "Action",
//                 "Biography",
//                 "Drama",
//                 "Sport"
//             ],
//             "image_url": "http://ia.media-imdb.com/images/M/MV5BMTQyMDE0MTY0OV5BMl5BanBnXkFtZTcwMjI2OTI0OQ@@._V1_SX400_.jpg",
//             "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda.",
//             "rank": 2,
//             "running_time_secs": 7380,
//             "actors": [
//                 "Daniel Bruhl",
//                 "Chris Hemsworth",
//                 "Olivia Wilde"
//             ]
//         }
//     },
//     ...
// ]

import fs, { write } from "fs";
import * as R from "ramda";
import { ddbDocClient } from "./ddbDocClient.js";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "./env.js";
import wait from "waait";

export const writeData = async () => {
  const allMovies = JSON.parse(fs.readFileSync("../moviedata.json", "utf8"));
  const segments = R.splitEvery(5, allMovies);

  try {
    for (const i in segments) {
      const segment = segments[i];
      const reqs = [];
      for (const item of segment) {
        reqs.push({
          PutRequest: {
            Item: {
              year: item.year,
              title: item.title,
              info: item.info,
            },
          },
        });
      }
      ddbDocClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: reqs,
          },
        }),
      );
      console.log(`> segment ${i} : ${segment.length} items pushed`);
      // throttle requests
      await wait(1000);
    }
    console.log("Success, table updated.");
  } catch (error) {
    console.log("Error", error);
  }
};
writeData();
