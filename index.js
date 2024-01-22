import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { OpenAI } from "openai"; // Import the OpenAI class
import openAiRoutes from "./routes/openai.js";
import langChainRoutes from "./routes/langChainChat.js";
import openAiChatBotRoutes from "./routes/openAiChatBot.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import { connectDb } from "./config/dbConfig.js";
import { validateToken } from "./middleware/validateTokenHandler.js";
import Razorpay from "razorpay";

dotenv.config();

connectDb();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/openAi", validateToken, openAiRoutes);
app.use("/openAi2", openAiChatBotRoutes);
app.use("/lang", langChainRoutes);
app.use("/auth", authRoutes);
app.use("/api", productRoutes);

export const openai = new OpenAI({
  organization: "org-yJOJ0HwL1ws3laVY1hwtD096",
  apiKey: "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",
});

if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  throw new Error("Razorpay credentials are missing.");
}

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
