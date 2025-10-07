import { useState } from "react";
import axios from "axios";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/auth/register", { name, email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
    } catch(err) {
      console.error(err);
      alert("Registration failed");
    }
  };


  return (
    <form onSubmit={handleRegister} style={{ textAlign: "center", marginTop: 50 }}>
      <h2>🧍 Register</h2>
      <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
