import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import TakeQuiz from "./components/TakeQuiz";
import Login from "./components/Login";
import Register from "./components/Register";  // ✅ Import Register
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showRegister, setShowRegister] = useState(false); // ✅ Added this state

  // ✅ Load saved user info from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // ✅ Fetch quizzes for normal users (not admin)
  useEffect(() => {
    if (user && user.role !== "admin") {
      axios.get("/api/quizzes")
        .then((res) => setQuizzes(res.data))
        .catch((err) => console.error("Error fetching quizzes:", err));
    }
  }, [user]);

  // ✅ Show login or register screen
  if (!user) {
    return showRegister ? (
      <Register onRegisterSuccess={() => setShowRegister(false)} />
    ) : (
      <Login setUser={setUser} setShowRegister={setShowRegister} />
    );
    
  }
  
  const userRole = user.role || "user"; // Default to "user" if role is undefined

  if (userRole === "admin") {
    return <AdminDashboard user={user} />;
  }

  // ✅ When user selects a quiz
  
  if (selectedQuiz||selectedQuiz!==null) {
    return (
      <TakeQuiz
        quizId={selectedQuiz._id}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  // ✅ Normal user quiz selection page
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>🧠 Welcome, {user.name}</h1>
      <h2>Select a Quiz</h2>
      {/* <AdminDashboard user={user}/> */}
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
