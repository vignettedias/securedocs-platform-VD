import { Request, Response } from "express";

import {
  createDocument,
  getDocumentsByOwner,
  getDocumentById,
  deleteDocument
} from "./document.service";

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