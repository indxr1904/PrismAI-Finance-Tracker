import express from "express";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { type, amount, category, merchant, description, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = new Transaction({
      userId: req.user._id,
      type,
      amount,
      category,
      merchant,
      description,
      date: date ? new Date(date) : new Date(),
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("❌ Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });

    const balance = transactions.reduce((acc, t) => {
      return acc + (t.type === "income" ? t.amount : -t.amount);
    }, 0);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthlyTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const income = monthlyTx
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = monthlyTx
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const savings = income - expenses;

    const breakdown = {};
    monthlyTx.forEach((t) => {
      if (t.type === "expense") {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      }
    });

    res.json({
      totals: { balance },
      monthly: { income, expenses, savings },
      breakdown,
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
