import express from "express";
import Result from "../models/Result.js";

const router = express.Router();

// 🏅 Get leaderboard for all quizzes
router.get("/", async (req, res) => {
  const topResults = await Result.find()
    .populate("user", "name email")
    .sort({ percentage: -1 })
    .limit(10);

  res.json(topResults);
});

// 🏆 Leaderboard by quiz
router.get("/:quizId", async (req, res) => {
  const topResults = await Result.find({ quiz: req.params.quizId })
    .populate("user", "name email")
    .sort({ percentage: -1 })
    .limit(10);

  res.json(topResults);
});

export default router;
