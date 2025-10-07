import { useState, useEffect } from "react";
import axios from "axios";

function QuizTake({ quizId, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Load quiz questions
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${quizId}/questions`)
      .then((res) => setQuestions(res.data.questions || []))
      .catch((err) => console.error(err));
  }, [quizId]);

  // Handle option selection
  const handleOptionChange = (questionId, index) => {
    setAnswers({ ...answers, [questionId]: index });
  };

  // Submit quiz
  const handleSubmit = async () => {
    try {
      const payload = {
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          selectedOptionIndex: answers[questionId],
        })),
      };

      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

      const res = await axios.post(
        `http://localhost:8000/api/quizzes/${quizId}/submit`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz");
    }
  };

  // After submission
  if (score) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Quiz Submitted Successfully!</h2>
        <h2>
          Your Score: {score.score} / {score.totalQuestions}
        </h2>
        <h3>Percentage: {score.percentage.toFixed(2)}%</h3>
        <button onClick={onBack}>Back to Quizzes</button>
      </div>
    );
  }

  // Quiz taking page
  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={onBack}>Back to Quizzes</button>
      <h2>Take Quiz</h2>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {questions.map((q) => (
            <div key={q._id} style={{ marginBottom: 20 }}>
              <h3>{q.questionText}</h3>
              {q.options.map((o, i) => (
                <label key={i} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q._id}
                    value={i}
                    checked={answers[q._id] === i}
                    onChange={() => handleOptionChange(q._id, i)}
                  />
                  {o}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit Quiz</button>
        </form>
      )}
    </div>
  );
}

export default QuizTake;
