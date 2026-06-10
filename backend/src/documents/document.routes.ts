import { Router } from "express";

import {
  create,
  list,
  getOne,
  remove,
  uploadDocument
} from "./document.controller";

import { requireAuth } from "../middleware/auth.middleware";

import { upload } from "./multer";

const router = Router();

router.use(requireAuth);

router.post("/", create);

router.post(
  "/upload",
  upload.single("file"),
  uploadDocument
);

router.get("/", list);

router.get("/:id", getOne);

router.delete("/:id", remove);

export default router;