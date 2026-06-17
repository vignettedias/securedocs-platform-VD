import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import {
  createDocument,
  createUploadedDocument,
  getDocumentsByOwner,
  getDocumentById,
  deleteDocument
} from "./document.service";

import {
  encryptFile,
  decryptFile
} from "../services/fernet.service";

export async function create(
  req: Request,
  res: Response
) {
  try {
    const user =
      req.session.user!;

    const {
      filename,
      storagePath,
      mimeType,
      fileSize
    } = req.body;

    const document =
      await createDocument(
        user.id,
        filename,
        storagePath,
        mimeType,
        fileSize
      );

    res.status(201).json(
      document
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create document"
    });
  }
}

export async function uploadDocument(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const encryptedResult =
      await encryptFile(
        req.file.path
      );

    const document =
      await createUploadedDocument(
        req.session.user!.id,
        req.file
      );

    res.status(201).json({
      document,
      encryption:
        encryptedResult
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Upload and encryption failed"
    });
  }
}

export async function list(
  req: Request,
  res: Response
) {
  try {
    const user =
      req.session.user!;

    const documents =
      await getDocumentsByOwner(
        user.id
      );

    res.json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch documents"
    });
  }
}

export async function getOne(
  req: Request,
  res: Response
) {
  try {
    const id =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    if (!id) {
      return res.status(400).json({
        error: "Document ID required"
      });
    }

    const document =
      await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    if (
      document.ownerId !==
      req.session.user!.id
    ) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    res.json(document);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch document"
    });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  try {
    const id =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    if (!id) {
      return res.status(400).json({
        error: "Document ID required"
      });
    }

    const document =
      await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    if (
      document.ownerId !==
      req.session.user!.id
    ) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    await deleteDocument(
      document.id
    );

    res.json({
      success: true
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete document"
    });
  }
}
export async function downloadDocument(
  req: Request,
  res: Response
) {
  try {

    const id =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    if (!id) {
      return res.status(400).json({
        error: "Document ID required"
      });
    }

    const document =
      await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    if (
      document.ownerId !==
      req.session.user!.id
    ) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    const filePath =
      path.resolve(
        document.storagePath
      );

    if (
      !fs.existsSync(filePath)
    ) {
      return res.status(404).json({
        error: "File missing"
      });
    }

    return res.download(
      filePath,
      document.filename
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Download failed"
    });

  }
}
export async function decryptDocument(
  req: Request,
  res: Response
) {
  try {

    const id =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    if (!id) {
      return res.status(400).json({
        error: "Document ID required"
      });
    }

    const document =
      await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        error: "Document not found"
      });
    }

    if (
      document.ownerId !==
      req.session.user!.id
    ) {
      return res.status(403).json({
        error: "Forbidden"
      });
    }

    if (
      !document.encryptedPath
    ) {
      return res.status(400).json({
        error:
          "Document is not encrypted"
      });
    }

    const encryptedFileName =
      path.basename(
        document.encryptedPath
      );

    const stream =
      await decryptFile(
        encryptedFileName,
        document.filename
      );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.filename}"`
    );

    res.setHeader(
      "Content-Type",
      "application/octet-stream"
    );
stream.on(
  "error",
  (err) => {
    console.error(
      "STREAM ERROR:",
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        error:
          "Stream failed"
      });
    }
  }
);
    stream.pipe(res);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Decryption failed"
    });

  }
}