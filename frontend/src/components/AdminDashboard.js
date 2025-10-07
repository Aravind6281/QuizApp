import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function AdminDashboard({ user }) {
  const [analytics, setAnalytics] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const config = {
    headers: { Authorization: `Bearer ${user.token}` },
  };

  // Fetch analytics + quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = await axios.get("http://localhost:8000/api/admin/analytics", config);
        const q = await axios.get("http://localhost:8000/api/admin/quizzes", config);
        setAnalytics(a.data);
        setQuizzes(q.data);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    fetchData();
  }, []);

  // Create quiz
  const createQuiz = async () => {
    if (!newTitle.trim()) return;
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/admin/quizzes",
        { title: newTitle },
        config
      );
      setQuizzes([data, ...quizzes]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to create quiz", err);
    }
  };

  // Delete quiz
  const deleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/quizzes/${id}`, config);
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Failed to delete quiz", err);
    }
  };

  // Fetch leaderboard for selected quiz
  useEffect(() => {
    if (showLeaderboard && selectedQuiz) {
      const fetchLeaderboard = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8000/api/quizzes/${selectedQuiz._id}/results`,
            config
          );
          setLeaderboard(data);
        } catch (err) {
          console.error("Failed to fetch leaderboard", err);
        }
      };
      fetchLeaderboard();
    }
  }, [showLeaderboard, selectedQuiz]);

  if (showLeaderboard && selectedQuiz) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>🏅 Leaderboard: {selectedQuiz.title}</h1>
        <button onClick={() => setShowLeaderboard(false)}>⬅ Back to Dashboard</button>

        {leaderboard.length === 0 ? (
          <p>No leaderboard data available.</p>
        ) : (
          <table style={{ margin: "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: 5 }}>Rank</th>
                <th style={{ border: "1px solid black", padding: 5 }}>Name</th>
                <th style={{ border: "1px solid black", padding: 5 }}>Score</th>
                <th style={{ border: "1px solid black", padding: 5 }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r, index) => (
                <tr key={r._id}>
                  <td style={{ border: "1px solid black", padding: 5 }}>{index + 1}</td>
                  <td style={{ border: "1px solid black", padding: 5 }}>{r.user?.name || "Unknown"}</td>
                  <td style={{ border: "1px solid black", padding: 5 }}>{r.score}</td>
                  <td style={{ border: "1px solid black", padding: 5 }}>{r.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>👑 Admin Dashboard</h1>
      <h3>Welcome, {user.name}</h3>

      {/* Analytics */}
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

      {/* Quiz Management */}
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
            <li key={q._id} style={{ marginBottom: 10 }}>
              {q.title}
              <button
                onClick={() => deleteQuiz(q._id)}
                style={{ marginLeft: 10 }}
              >
                🗑️
              </button>
              <button
                onClick={() => {
                  setSelectedQuiz(q);
                  setShowLeaderboard(true);
                }}
                style={{ marginLeft: 10 }}
              >
                🏅 View Leaderboard
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Reports */}
      <div>
        <h3>📤 Export Reports</h3>
        <button onClick={() => window.open("http://localhost:8000/api/export/csv")}>Download CSV</button>
        <button onClick={() => window.open("http://localhost:8000/api/export/pdf")}>Download PDF</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
