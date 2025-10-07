import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function AdminDashboard({ user }) {
  const [analytics, setAnalytics] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  // Fetch analytics + quizzes
  useEffect(() => {
    const fetchData = async () => {
      const a = await axios.get("http://localhost:8000/api/admin/analytics", config);
      const q = await axios.get("http://localhost:8000/api/admin/quizzes", config);
      setAnalytics(a.data);
      setQuizzes(q.data);
    };
    fetchData();
  }, []);

  // Create quiz
  const createQuiz = async () => {
    if (!newTitle.trim()) return;
    const { data } = await axios.post("http://localhost:8000/api/admin/quizzes", { title: newTitle }, config);
    setQuizzes([data, ...quizzes]);
    setNewTitle("");
  };

  // Delete quiz
  const deleteQuiz = async (id) => {
    if (window.confirm("Delete this quiz?")) {
      await axios.delete(`http://localhost:8000/api/admin/quizzes/${id}`, config);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    const { data } = await axios.get("http://localhost:8000/api/admin/leaderboard", config);
    setLeaderboard(data);
  };

  // Handle leaderboard toggle
  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [showLeaderboard]);

  if (showLeaderboard) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>🏅 Leaderboard</h1>
        <button onClick={() => setShowLeaderboard(false)}>⬅ Back to Dashboard</button>

        {leaderboard.length === 0 ? (
          <p>No leaderboard data available.</p>
        ) : (
          <ol>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {entry.userName} — {entry.score} points
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>👑 Admin Dashboard</h1>
      <h3>Welcome, {user.name}</h3>

      <div style={{ margin: 30 }}>
        <h2>📊 Platform Analytics</h2>
        <p>Total Users: {analytics.totalUsers}</p>
        <p>Total Quizzes: {analytics.totalQuizzes}</p>
        <p>Total Attempts: {analytics.totalAttempts}</p>
        <p>Average Score: {analytics.averageScore}%</p>

        <PieChart width={400} height={250}>
          <Pie
            dataKey="value"
            data={[
              { name: "Quizzes", value: analytics.totalQuizzes || 0 },
              { name: "Attempts", value: analytics.totalAttempts || 0 },
            ]}
            fill="#8884d8"
            label
          >
            <Cell fill="#82ca9d" />
            <Cell fill="#8884d8" />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div>
        <h2>🧩 Manage Quizzes</h2>
        <input
          type="text"
          placeholder="New quiz title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createQuiz}>Create Quiz</button>

        <ul>
          {quizzes.map((q) => (
            <li key={q._id}>
              {q.title}
              <button
                onClick={() => deleteQuiz(q._id)}
                style={{ marginLeft: 10 }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
  <h3>📤 Export Reports</h3>
  <button onClick={() => window.open("http://localhost:8000/api/export/csv")}>Download CSV</button>
  <button onClick={() => window.open("http://localhost:8000/api/export/pdf")}>Download PDF</button>
</div>

      <button onClick={() => setShowLeaderboard(true)}>🏅 View Leaderboard</button>
    </div>
  );
}

export default AdminDashboard;
