import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext"; // Import Context

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please include an '@' in the email.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        login(user);
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
};

export default Login;
