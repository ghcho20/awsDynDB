import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";
import { TABLE_NAME } from "./env.js";

export const deleteTable = async () => {
  try {
    const data = await ddbClient.send(
      new DeleteTableCommand({
        TableName: TABLE_NAME,
      }),
    );
    console.log("Success, table deleted", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
deleteTable();
