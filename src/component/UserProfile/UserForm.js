import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [errors, setErrors] = useState({}); // State to store validation errors

  const validateForm = () => {
    let formErrors = {};

    if (!name.trim()) formErrors.name = "Name is required.";
    if (!email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      formErrors.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      formErrors.password = "Password is required.";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      await axios.post("http://localhost:4000/users", {
        name,
        email,
        password,
        role,
      });

      alert("User added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <div>
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={onClose}>Cancel</button><br />

        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> <br />
        
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
        
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
        

        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select><br />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default UserForm;
