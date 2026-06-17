import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const FERNET_URL =
  process.env.FERNET_SERVICE_URL ||
  "http://fernet-rest-service:4000";
const API_KEY =
  process.env.FERNET_API_KEY ||
  "fernet-dev-api-key";

export async function encryptFile(
  filePath: string
) {
  try {
    const formData =
      new FormData();

    formData.append(
      "file",
      fs.createReadStream(filePath)
    );

    const response =
      await axios.post(
        `${FERNET_URL}/api/v1/encrypt-file`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "x-api-key": API_KEY
          }
        }
      );

    console.log(
      "FERNET RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "FERNET ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
}
export async function decryptFile(
  encryptedFileName: string,
  originalFileName: string
) {
  try {

    const response =
      await axios.post(
        `${FERNET_URL}/api/v1/decrypt-file`,
        {
          encryptedFileName,
          originalFileName
        },
        {
          headers: {
            "x-api-key": API_KEY
          },

          responseType: "stream"
        }
      );

    console.log(
      "FERNET STREAM RECEIVED"
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "FERNET DECRYPT ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
}