import { Request, Response } from "express";
import { prisma } from "../config/prisma";

import {
  createLoginUrl,
  exchangeCode
} from "./auth.service";

export async function login(
  req: Request,
  res: Response
) {
  try {
    const result =
      await createLoginUrl();

    req.session.state =
      result.state;

    res.redirect(
      result.authorizationUrl
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Login failed"
    });
  }
}

export async function callback(
  req: Request,
  res: Response
) {
  try {
    if (
      req.query.state !==
      req.session.state
    ) {
      return res.status(400).json({
        error: "Invalid state"
      });
    }

    const fullUrl =
      `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const tokens =
      await exchangeCode(
        fullUrl,
        req.session.state!
      );

    const payload = JSON.parse(
      Buffer.from(
        tokens.id_token!.split(".")[1],
        "base64"
      ).toString()
    );

    const dbUser =
      await prisma.user.upsert({
        where: {
          oidcSub: payload.sub
        },
        update: {
          email: payload.email,
          name: payload.name
        },
        create: {
          oidcSub: payload.sub,
          email: payload.email,
          name: payload.name
        }
      });

    req.session.user = {
  id: dbUser.id,
  sub: dbUser.oidcSub,
  email: dbUser.email ?? undefined,
  name: dbUser.name ?? undefined
};

    req.session.save((err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Session save failed"
        });
      }

      res.json({
        authenticated: true,
        user: req.session.user
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: String(error)
    });
  }
}

export function me(
  req: Request,
  res: Response
) {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false
    });
  }

  res.json({
    authenticated: true,
    user: req.session.user
  });
}

export function logout(
  req: Request,
  res: Response
) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed"
      });
    }

    res.json({
      authenticated: false
    });
  });
}