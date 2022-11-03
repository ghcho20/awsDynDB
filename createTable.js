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

import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";
import { TABLE_NAME } from "./env.js";

const tableName = TABLE_NAME;
export const createTable = async () => {
  // Set the parameters.
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: "title",
        AttributeType: "S",
      },
      {
        AttributeName: "year",
        AttributeType: "N",
      },
    ],
    KeySchema: [
      {
        AttributeName: "title",
        KeyType: "HASH",
      },
      {
        AttributeName: "year",
        KeyType: "RANGE",
      },
    ],
    TableName: tableName,
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };
  try {
    const data = await ddbClient.send(new CreateTableCommand(params));
    console.log(
      "Table created. Table name is ",
      data.TableDescription.TableName,
    );
  } catch (err) {
    console.log("Error", err);
  }
};
createTable();
