import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SecureDocs API running on port ${PORT}`);
});