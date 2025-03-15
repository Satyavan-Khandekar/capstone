import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm"; 
import UserHistory from "./UserHistory";

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store user ID & name
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      axios
        .get("http://localhost:4000/users")
        .then((resp) => {
          const filteredUsers = resp.data.filter((u) => u.role !== "admin");
          setUsers(filteredUsers);
        })
        .catch((error) => console.error("Error fetching users:", error));
    } else {
      axios
        .get(`http://localhost:4000/tasks?assignedTo=${user.id}`)
        .then((resp) => setTasks(resp.data))
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [user, navigate]);

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h2>User Profiles</h2>

      {user.role === "admin" ? (
        <>
          {!showForm && <button onClick={() => setShowForm(true)}>Add New User</button>}
          {showForm && <UserForm onClose={() => setShowForm(false)} />}

          <ul>
            {users.map((u) => (
              <li key={u.id}>
                <strong>Name:</strong> {u.name} <br />
                <strong>Email:</strong> {u.email} <br />
                <button onClick={() => setSelectedUser({ id: u.id, name: u.name })}>
                  Get History
                </button>
              </li>
            ))}
          </ul>

          {/* Show UserHistory when a user is selected */}
          {selectedUser && (
            <div>
              <UserHistory userId={selectedUser.id} userName={selectedUser.name} />
            </div>
          )}
        </>
      ) : (
        <>
          <h3>Tasks Worked By {user.name}</h3>
          <ul>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id}>
                  <strong>Title:</strong> {task.title} <br />
                  <strong>Description:</strong> {task.description} <br />
                  <strong>Status:</strong> {task.status}
                </li>
              ))
            ) : (
              <p>No tasks assigned.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default UserProfile;
