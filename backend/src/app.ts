import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./auth/auth.routes";
import { prisma } from "./config/prisma";
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);


app.get("/db-test", async (_req, res) => {
  const result =
    await prisma.user.findMany();

  res.json(result);
});
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SecureDocs API running on port ${PORT}`);
});