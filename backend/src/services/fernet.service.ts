import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const FERNET_URL =
  process.env.FERNET_URL ||
  "http://host.docker.internal:3000";

const API_KEY =
  process.env.FERNET_API_KEY ||
  "fernet-dev-api-key";

export async function encryptFile(
  filePath: string
) {
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
          "x-api-key":
            API_KEY
        }
      }
    );

  return response.data;
}