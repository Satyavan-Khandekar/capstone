import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext"; // Import Context

const SignUp = () => {
  const { login } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please include an '@' in the email.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;

      if (users.some((user) => user.email === email)) {
        setError("Email already exists. Please use another email.");
        return;
      }

      const newUser = { name, email, password, role: "employee" };
      await axios.post("http://localhost:4000/users", newUser);

      // Auto-login after sign-up
      login(newUser);
      navigate("/");
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <label>Name: </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
