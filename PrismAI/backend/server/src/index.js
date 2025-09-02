import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();
console.log("🔑 OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error("❌ CORS blocked for:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("🔍", req.method, req.url, "from:", req.headers.origin);
  next();
});

mongoose
  .connect(process.env.MONGO_URI, { dbName: "finance-tracker" })
  .then(() => console.log("✅ MongoDB connected to", mongoose.connection.name))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
