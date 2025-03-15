import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext"; // Import Context

const SignUp = () => {
  const { login } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};

    if (!name.trim()) {
      formErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required.";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      const response = await axios.get("http://localhost:4000/users");
      const users = response.data;

      if (users.some((user) => user.email === email)) {
        setErrors({ email: "Email already exists. Please use another email." });
        return;
      }

      const newUser = { name, email, password, role: "employee" };
      await axios.post("http://localhost:4000/users", newUser);

      // Auto-login after sign-up
      login(newUser);
      navigate("/");
    } catch (err) {
      setErrors({ general: "Error signing up. Please try again." });
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      <form onSubmit={handleSignUp}>
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        <label>Name: </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> <br />

        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />

        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
