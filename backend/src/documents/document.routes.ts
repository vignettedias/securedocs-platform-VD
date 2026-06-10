import { Router } from "express";

import {
  create,
  list,
  getOne,
  remove
} from "./document.controller";

import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", create);

router.get("/", list);

router.get("/:id", getOne);

router.delete("/:id", remove);

export default router;