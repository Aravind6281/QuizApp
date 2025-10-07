import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard({ quizId, onBack }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if(!quizId) return; 
    axios
      .get(`http://localhost:8000/api/quizzes/${quizId}/results`)
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, [quizId]);

  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <button onClick={onBack}>Back</button>
      <h2>Leaderboard</h2>
      {results.length === 0 ? (
        <p>No results yet.</p>
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
            {results.map((r, index) => (
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

export default Leaderboard;
