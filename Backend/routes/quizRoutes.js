import { protect } from "../middleware/authMiddleware.js";
import express from "express";
import Quiz from "../models/Quiz.js";

const router=express.Router();

router.post("/",async(req,res)=>{
    try{
        const {title}=req.body;
        const newQuiz=new Quiz({title});
        await newQuiz.save();
        res.status(201).json({newQuiz});
    }catch(err){
        res.status(500).json({err:"server error"});
    }
});
router.get("/",async(req,res)=>{
    try{
        const quizzes=await Quiz.find().sort({createdAt:-1});
        res.json({quizzes});
    }catch(err){
        res.status(500).json({err:"server error"});
    }
})
router.post("/:quizId/submit",async(req,res)=>{
    try{
        const {quizId}=req.params.quizId;
        const {answers}=req.body; 
        const questions=await Question.find({quizId:quizId});
        let score=0;
        questions.forEach((q)=>{
            const userAnswer=answers.find(a=>a.questionId===q._id.toString());
            // if(!userAnswer) return;
            // const correctOptionIndex=q.options.findIndex(opt=>opt.isCorrect===true);
            if(userAnswer&&userAnswer.selectedOptionIndex===q.correctOptionIndex){
                score++;
            }
        });
        const percentage=(score/questions.length)*100;
        const result=new Result({quizId,score,totalQuestions:questions.length,percentage});
        await result.save();
        res.json(result);
    }catch(err){
        res.status(500).json({err:"Failed to Evaluate quiz"});
    }
})

router.post("/:quizId/submit", protect, async (req, res) => {
  // only logged-in users can submit
  const userId = req.user._id;
  const result = new Result({
    quizId,
    user: userId,
    score,
    total: questions.length,
    percentage,
  });
  await result.save();
  res.json(result);
});

router.get("/:quizId/results",async(req,res)=>{
    try{
        const {quizId}=req.params;
        const results=await Result.find({quizId}).sort({date:-1});
        res.json(results);
    }catch(err){
        res.status(500).json({err:"failed to fetch error"});
    }
}   );
export default router;