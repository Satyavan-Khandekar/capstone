import React, { useEffect, useState } from "react";
import axios from "axios";

const UserHistory = ({ userId, userName }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/tasks?assignedTo=${userId}`)
      .then((resp) => setTasks(resp.data))
      .catch((error) => console.error("Error fetching task history:", error));
  }, [userId]);

  return (
    <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
      <h3>Tasks Worked By {userName || "Unknown Employee"}</h3>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "10px" }}>
              <strong>Title:</strong> {task.title} <br />
              <strong>Description:</strong> {task.description} <br />
              <strong>Status:</strong> {task.status}
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
};

export default UserHistory;
