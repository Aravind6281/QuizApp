import { useEffect, useState } from "react";
import axios from "axios";

function TakeQuiz({ quizId, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for demo

  useEffect(() => {
    axios.get(`http://localhost:8000/api/questions/${quizId}/questions`).then(res => setQuestions(res.data));
  }, [quizId]);

  useEffect(() => {
    if (timeLeft <= 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (qId, idx) => setAnswers({ ...answers, [qId]: idx });

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([qId, selectedOptionIndex]) => ({
      questionId: qId, selectedOptionIndex
    }));
    const res = await axios.post(`http://localhost:8000/api/quizzes/${quizId}/submit`, { answers: formattedAnswers });
    setScore(res.data);
  };

  if (score) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>✅ Quiz Completed!</h2>
        <p>Score: {score.score}/{score.total}</p>
        <p>Percentage: {score.percentage}%</p>
        <button onClick={onBack}>🔙 Back to Quizzes</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>🧠 Take Quiz</h2>
      <p>⏱️ Time Left: {timeLeft}s</p>

      {questions.map((q, i) => (
        <div key={q._id} style={{ margin: 20 }}>
          <h4>{i + 1}. {q.questionText}</h4>
          {q.options.map((opt, idx) => (
            <label key={idx} style={{ display: "block" }}>
              <input
                type="radio"
                name={q._id}
                checked={answers[q._id] === idx}
                onChange={() => handleOptionSelect(q._id, idx)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}

export default TakeQuiz;
