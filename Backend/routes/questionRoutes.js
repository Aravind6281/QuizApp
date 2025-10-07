import express from 'express';
import Question from '../models/Question.js';

const router=express.Router();
router.post("/:quizzId/questions",async(req,res)=>{
    try{
        const {text,options}=req.body;
        const {quizzId}=req.params;
        const newQuestion=new Question({quizId:quizzId,text,options});
        await newQuestion.save();
        res.status(201).json({newQuestion});
    }catch(err){
        res.status(500).json({err:"server error"});
    }   
});
router.get("/:quizzId/questions",async(req,res)=>{
    try{
        const {quizzId}=req.params;
        const questions=await Question.find({quizId:quizzId});
        res.json({questions});
    }catch(err){
        res.status(500).json({err:"server error"});
    }
});

router.post("/:quizzId/submit",async(req,res)=>{
    try{
        const {quizzId}=req.params;
        const {answers}=req.body; 
        const questions=await Question.find({quizId:quizzId});
        let score=0;
        questions.forEach(q=>{
            const userAnswer=answers.find(a=>a.questionId===q._id.toString());
            if(!userAnswer) return;
            const correctOptionIndex=q.options.findIndex(opt=>opt.isCorrect===true);
            if(userAnswer.selectedOptionIndex===correctOptionIndex){
                score++;
            }
        });
        res.json({score,total:questions.length});
    }catch(err){
        res.status(500).json({err:"Failed to Evaluate quiz"});
    }
});

export default router;