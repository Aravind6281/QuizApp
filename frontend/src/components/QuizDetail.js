import {useState,useEffect} from 'react';
import axios from 'axios';

function QuizDetail({quizId,onBack}){
    const[questions,setQuestions]=useState([]);
    useEffect(()=>{ 
        axios.get(`http://localhost:8000/api/quizzes/${quizId}/questions`).then(res=>setQuestions(res.data.questions)).catch(err=>console.log(err));
    },[quizId]);
    return(
        <div style={{textAlign:"center"}}>
            <button onClick={onBack}>Back to Quizzes</button>
            <h2>Questions</h2>
            {questions.length===0 ? (
                <p>No questions available for this quiz.</p>
            ):(
                <ul style={{listStyleType:"none", padding:0}}>
                    {questions.map(q=>(
                        <li key={q._id} style={{marginBottom:"20px"}}>
                            <strong>{q.text}</strong>
                            <ul style={{listStyleType:"none", padding:0}}>
                                {q.options.map((opt,index)=>(
                                    <li key={index}>{opt}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};
export default QuizDetail;

