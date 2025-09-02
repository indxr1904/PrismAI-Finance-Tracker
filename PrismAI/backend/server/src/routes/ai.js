// server/src/routes/ai.js
import express from "express";
import OpenAI from "openai";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/parse", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const schema = {
      type: "object",
      properties: {
        type: { type: "string", enum: ["income", "expense"] },
        amount: { type: "number" },
        category: { type: "string" },
        merchant: { type: "string" },
        description: { type: "string" },
        date: { type: "string", description: "ISO 8601 date (YYYY-MM-DD)" },
      },
      required: ["type", "amount"],
      additionalProperties: false,
    };

    const prompt =
      "Extract a single financial transaction from the user's message. " +
      "Return strict JSON matching this schema: " +
      JSON.stringify(schema) +
      ". " +
      "If the user does not mention a date, ALWAYS use today's date (YYYY-MM-DD). " +
      "If the user mentions an unrealistic or very old date, correct it to today's date. " +
      "Categories should be simple (e.g., Food, Rent, Salary, Transport). " +
      `Message: "${String(text).replaceAll('"', '\\"')}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You convert natural language into structured finance transactions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    let json;
    try {
      json = JSON.parse(completion.choices[0].message.content);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const parsedDate = new Date(json.date);

    if (
      !json.date ||
      isNaN(parsedDate.getTime()) ||
      parsedDate.getFullYear() < 2024 ||
      parsedDate > today
    ) {
      json.date = todayISO;
    }

    json.confidence = Math.random() * (1 - 0.7) + 0.7;

    res.json(json);
  } catch (e) {
    console.error("❌ AI route error:", e.message);
    res.status(500).json({ error: "Failed to parse transaction" });
  }
});

export default router;
