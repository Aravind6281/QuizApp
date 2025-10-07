import { useState,useEffect } from "react";
import axios from "axios";

function QuizTake({quizId,onBack}){
    const[questions,setQuestions]=useState([]);
    const[answers,setAnswers]=useState([]);
    const[score,setScore]=useState(null);
    useEffect(()=>{
        axios.get(`http://localhost:8000/api/quizzes/${quizId}/questions`).then(res=>setQuestions(res.data.questions)).catch(err=>console.log(err));
    },[quizId]);
    const handleOptionChanges=(questionId,index)=>{
        setAnswers({...answers,[questionId]:index});
    };
    const handleSubmit=async()=>{
        const payload={answers:Object.keys(answers).map(quizId=>({
            questionId:quizId,
            selectedOptionIndex:answers[quizId]
        })),
    };
    const res=await axios.post(`http://localhost:8000/api/quizzes/${quizId}/submit`,payload);
    setScore(res.data);
    };
    if(score){
        return(
            <div style={{textAlign:"center"}}>
                <h2>Quiz Submitted Successfully!</h2>
                <h2>Your Score: {score.score} out of {score.total}</h2>
                <button onClick={onBack}>Back to Quizzes</button>
            </div>
        )
    }

    return(
        <div style={{textAlign:"center"}}>
            <button onClick={onBack}>Back to Quizzes</button>   
            <h2>Take Quiz</h2>
            {questions.length===0?(<p>No questions</p>):(
                <form onSubmit={(e)=>{e.preventDefault();
                    handleSubmit();}}>
                    {questions.map((q) => (
                        <div key={q._id} style={{marginBottom:25}}>
                            <h3>{q.text}</h3>
                            {q.options.map((o,i)=>(
                                <label key={i} style={{display:"block"}}>
                                    <input type="radio" name={q._id} value={i} checked={answers.q._id===i}
                                    onChange={()=>handleOptionChanges(q._id,i)}/>
                                    {o.text}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button type="submit">Submit Quiz</button>
                </form>
                )}
        </div>
    )
};
export default QuizTake;