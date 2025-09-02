import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user._id);
    res.json({ user, token });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ user, token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const googleToken = req.body.credential || req.body.token;

    if (!googleToken) {
      return res.status(400).json({ error: "Missing Google token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log("✅ Google token audience:", payload.aud);
    console.log("✅ Expected audience:", process.env.GOOGLE_CLIENT_ID);

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        error: "Google token audience mismatch",
        received: payload.aud,
        expected: process.env.GOOGLE_CLIENT_ID,
      });
    }

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId: sub,
        provider: "google",
        password: null,
      });
    }

    const authToken = createToken(user._id);
    res.json({ user, token: authToken });
  } catch (err) {
    console.error("❌ Google auth error:", err.message);
    res
      .status(500)
      .json({ error: "Google authentication failed", details: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("❌ Auth me error:", err.message);
    res.status(401).json({ error: "Not authorized" });
  }
});

export default router;
