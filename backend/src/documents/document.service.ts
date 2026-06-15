import { prisma } from "../config/prisma";
import { encryptFile }
  from "../services/fernet.service";

export async function createDocument(
  ownerId: string,
  filename: string,
  storagePath: string,
  mimeType?: string,
  fileSize?: number
) {
  return prisma.document.create({
    data: {
      ownerId,
      filename,
      storagePath,
      mimeType,
      fileSize
    }
  });
}

export async function createUploadedDocument(
  ownerId: string,
  file: Express.Multer.File
) {
  const encryption =
    await encryptFile(
      file.path
    );

  return prisma.document.create({
    data: {
      ownerId,

      filename:
        file.originalname,

      storagePath:
        file.path,

      mimeType:
        file.mimetype,

      fileSize:
        file.size,

      isEncrypted:
        encryption.success === true,

      encryptedPath:
        encryption.encryptedPath,

      encryptedAt:
        encryption.success
          ? new Date()
          : null
    }
  });
}

export async function getDocumentsByOwner(
  ownerId: string
) {
  return prisma.document.findMany({
    where: {
      ownerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getDocumentById(
  id: string
) {
  return prisma.document.findUnique({
    where: {
      id
    }
  });
}

export async function deleteDocument(
  id: string
) {
  return prisma.document.delete({
    where: {
      id
    }
  });
}