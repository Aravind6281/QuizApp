import { useState } from "react";
import axios from "axios";

function Login({ setUser, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
    } catch {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>🔐 Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 20 }}>
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
