import React, { useState, useEffect } from "react";
import axios from "axios";

const ScrumForm = ({ onClose }) => {
  const [scrumName, setScrumName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/users")
      .then((resp) => setUsers(resp.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scrumName || !taskTitle || !taskDescription || !assignedTo) {
      alert("All fields are required.");
      return;
    }

    try {
      const scrumResponse = await axios.post("http://localhost:4000/scrums", { name: scrumName });

      await axios.post("http://localhost:4000/tasks", {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        scrumId: scrumResponse.data.id,
        assignedTo,
      });

      alert("Scrum and Task added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding scrum:", error);
      alert("Failed to add scrum.");
    }
  };

  return (
    <div>
      <h3>Add New Scrum</h3>
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={onClose}>Cancel</button><br />
        <label>Scrum Name:</label>
        <input type="text" value={scrumName} onChange={(e) => setScrumName(e.target.value)} required /><br />

        <label>Task Title:</label>
        <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required /><br />

        <label>Task Description:</label>
        <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required /><br />

        <label>Task Status:</label>
        <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select><br />

        <label>Assign To:</label>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select><br />

        <button type="submit">Create Scrum</button>

      </form>
    </div>
  );
};

export default ScrumForm;
