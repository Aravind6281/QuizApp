import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import QuizTake from "./components/QuizTake";
import Leaderboard from "./components/leaderboard";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "axios";

function App() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showRegister, setShowRegister] = useState(false);

  // Load saved user info
  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch quizzes
  useEffect(() => {
    if (user && user.role !== "user") {
      axios
        .get("http://localhost:8000/api/quizzes")
        .then((res) => {
          setQuizzes(Array.isArray(res.data.quizzes) ? res.data.quizzes : []);
        })
        .catch((err) => console.error("Error fetching quizzes:", err));
    }
  }, [user]);
  // Login/Register screen
 
  if (!user) {
    return showRegister ? (
      <Register onRegisterSuccess={() => setShowRegister(false)} />
    ) : (
      <Login setUser={setUser} setShowRegister={setShowRegister} />
    );
  }
  
  const userRole = user.role || "user";
  
  // Admin dashboard

  if (userRole === "user") {
    return <AdminDashboard user={user} />;
  }

  // Show leaderboard if selected
  if (showLeaderboard && selectedQuiz) {
    return (
      <Leaderboard
        quizId={selectedQuiz._id}
        onBack={() => setShowLeaderboard(false)}
      />
    );
  }

  // Show quiz-taking view
  if (selectedQuiz) {
    return (
      <QuizTake
        quizId={selectedQuiz._id}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  // Default quiz selection page
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>🧠 Welcome, {user.name}</h1>
      <h2>Select a Quiz</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        quizzes.map((q) => (
          <button
            key={q._id}
            onClick={() => setSelectedQuiz(q)}
            style={{ margin: 10 }}
          >
            {q.title}
          </button>
        ))
      )}

      {/* Show leaderboard button only if a quiz is selected */}
      {selectedQuiz && (
        <button
          onClick={() => setShowLeaderboard(true)}
          style={{ marginTop: 20 }}
        >
          View Leaderboard
        </button>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("userInfo");
          setUser(null);
        }}
        style={{
          display: "block",
          margin: "20px auto",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default App;
