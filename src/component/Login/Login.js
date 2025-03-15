import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext"; // Import Context

const Login = () => {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};

    if (!email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      formErrors.email = "Please include an '@' in the email.";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        login(user);
        navigate("/");
      } else {
        setErrors({ credentials: "Invalid email or password." });
      }
    } catch (err) {
      setErrors({ credentials: "Error logging in. Please try again." });
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {errors.credentials && <span style={{ color: "red" }}>{errors.credentials}</span>}
       
      

      <form onSubmit={handleLogin}>
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br/>

        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br/>

        <button type="submit">Login</button>
      </form>

      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
};

export default Login;
