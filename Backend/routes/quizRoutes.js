import express from "express";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Create a new quiz
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const newQuiz = new Quiz({ title });
    await newQuiz.save();
    res.status(201).json({ newQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

// 📚 Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ quizzes }); // always send object with quizzes array
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

// ❓ Get all questions for a quiz
// Get all questions for a quiz
router.get("/:quizId/questions", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questions = await Question.find({ quizId });
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});
 
// ➕ Add question to a quiz
router.post("/:quizId/questions", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctOptionIndex } = req.body;

    const newQuestion = new Question({
      quizId,
      questionText,
      options,
      correctOptionIndex,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to create question" });
  }
});


// 🏆 Submit quiz answers (only logged-in users)
router.post("/:quizId/submit", protect, async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.quizId;
  const userId = req.user._id;

  const questions = await Question.find({ quizId });
  let score = 0;
  questions.forEach(q => {
    const userAnswer = answers.find(a => a.questionId === q._id.toString());
    if (userAnswer && userAnswer.selectedOptionIndex === q.correctOptionIndex) {
      score++;
    }
  });
 const total = questions.length;
    const percentage = (score / total) * 100;

    // 4️⃣ Save result
    const result = new Result({
      quizId,
      user: userId,
      score,
      total,         // required by schema
      percentage,
    });



  await result.save();
  res.json(result);
});
// 📊 Get results for a quiz
router.get("/:quizId/results", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const results = await Result.find({ quizId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to fetch results" });
  }
});

// GET /api/quizzes/:quizId/leaderboard
router.get("/:quizId/leaderboard", async (req, res) => {
  try {
    const { quizId } = req.params;

    // Fetch results and populate user info
    const results = await Result.find({ quizId })
      .populate("user", "name")  // get user name
      .sort({ score: -1, percentage: -1 }); // highest score first

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to fetch leaderboard" });
  }
});

export default router;
