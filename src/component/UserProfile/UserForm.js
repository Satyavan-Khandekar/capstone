import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

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

        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> <br />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />

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
