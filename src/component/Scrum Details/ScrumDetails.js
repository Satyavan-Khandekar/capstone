import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const ScrumDetails = ({ scrumId }) => {
  const [scrumDetails, setScrumDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext); // Get logged-in user

  useEffect(() => {
    if (!scrumId) return;

    const fetchData = async () => {
      try {
        const scrumRes = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
        const tasksRes = await axios.get(`http://localhost:4000/tasks?scrumId=${scrumId}`);
        const usersRes = await axios.get(`http://localhost:4000/users`);

        setScrumDetails(scrumRes.data);
        setTasks(tasksRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scrumId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Scrum Details for {scrumDetails?.name}</h2>

      {/* Tasks Section */}
      <h3>Tasks</h3>
      <ul>
        {tasks.length > 0 ? tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}:</strong> {task.description} - <i>{task.status}</i>
            {user?.role === "admin" && (
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            )}
          </li>
        )) : <p>No tasks available</p>}
      </ul>

      {/* Users Section */}
      <h3>Users</h3>
      <ul>
        {tasks.map((task) => {
          const assignedUser = users.find(user => Number(user.id) === Number(task.assignedTo));
          return assignedUser ? (
            <li key={task.id}>
              {assignedUser.name} ({assignedUser.email})
            </li>
          ) : <li key={task.id}>No user assigned</li>;
        })}
      </ul>
    </div>
  );
};

export default ScrumDetails;
