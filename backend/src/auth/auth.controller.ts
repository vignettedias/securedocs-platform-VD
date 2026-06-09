import { Request, Response } from "express";
import { testDiscovery } from "./auth.service";

export async function login(
  _req: Request,
  res: Response
) {
  try {
    const result =
      await testDiscovery();

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Discovery failed"
    });
  }
}

export function callback(
  _req: Request,
  res: Response
) {
  res.send("OIDC callback route");
}

export function me(
  _req: Request,
  res: Response
) {
  res.send("Current user");
}

export function logout(
  _req: Request,
  res: Response
) {
  res.send("Logout");
}