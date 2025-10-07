import express from "express";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🧩 Get all quizzes
router.get("/quizzes", protect, adminOnly, async (req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  res.json(quizzes);
});

// ➕ Create a new quiz
router.post("/quizzes", protect, adminOnly, async (req, res) => {
  const { title } = req.body;
  const quiz = new Quiz({ title });
  await quiz.save();
  res.json(quiz);
});

// 🗑️ Delete a quiz
router.delete("/quizzes/:id", protect, adminOnly, async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  await Question.deleteMany({ quizId: req.params.id });
  res.json({ message: "Quiz deleted" });
});

// 📊 Get Analytics
router.get("/analytics", protect, adminOnly, async (req, res) => {
  const totalUsers = await Result.distinct("user").countDocuments();
  const totalQuizzes = await Quiz.countDocuments();
  const totalAttempts = await Result.countDocuments();
  const avgScore = await Result.aggregate([{ $group: { _id: null, avg: { $avg: "$percentage" } } }]);

  res.json({
    totalUsers,
    totalQuizzes,
    totalAttempts,
    averageScore: avgScore[0]?.avg?.toFixed(2) || 0,
  });
});

export default router;
