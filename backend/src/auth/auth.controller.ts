import { Request, Response } from "express";

export function login(
  _req: Request,
  res: Response
) {
  res.send("OIDC login route");
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