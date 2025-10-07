import express from 'express';
import Question from '../models/Question.js';

const router=express.Router();
router.post("/:quizzId/questions",async(req,res)=>{
    try{
        const {quizzId}=req.params;
const { questionText, options, correctOptionIndex } = req.body;
const newQuestion = new Question({ quizId: quizzId, questionText, options, correctOptionIndex });
        await newQuestion.save();
        res.status(201).json({newQuestion});
    }catch(err){
        res.status(500).json({err:"server error"});
    }   
});
router.get("/:quizId/questions", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questions = await Question.find({ quizId: new mongoose.Types.ObjectId(quizId) });
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error" });
  }
});

router.post("/:quizzId/submit", async (req, res) => {
  try {
    const { quizzId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedOptionIndex }]

    const questions = await Question.find({ quizId: quizzId });
    let score = 0;

    questions.forEach((q) => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      if (!userAnswer) return;

      // Use correctOptionIndex from schema
      if (userAnswer.selectedOptionIndex === q.correctOptionIndex) {
        score++;
      }
    });

    res.json({ score, total: questions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to evaluate quiz" });
  }
});


export default router;