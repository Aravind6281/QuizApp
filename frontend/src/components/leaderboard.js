import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard({ quizId, onBack }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const url = quizId ? `http://localhost:8000/api/leaderboard/${quizId}` : `http://localhost:8000/api/leaderboard`;
      const res = await axios.get(url);
      setData(res.data);
    };
    fetchLeaderboard();
  }, [quizId]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>🏆 Leaderboard</h1>
      <button onClick={onBack}>⬅️ Back</button>
      <table border="1" style={{ margin: "20px auto", padding: "10px" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Quiz</th>
            <th>Score (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r._id}>
              <td>{i + 1}</td>
              <td>{r.user?.name || "Anonymous"}</td>
              <td>{r.quizTitle || "General"}</td>
              <td>{r.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
