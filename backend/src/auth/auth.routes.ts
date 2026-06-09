import { Router } from "express";

const router = Router();

router.get("/login", (_req, res) => {
  res.send("OIDC login route");
});

router.get("/callback", (_req, res) => {
  res.send("OIDC callback route");
});

router.get("/me", (_req, res) => {
  res.send("Current user");
});

router.post("/logout", (_req, res) => {
  res.send("Logout");
});

export default router;