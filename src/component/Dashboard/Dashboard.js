import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import ScrumDetails from "../Scrum Details/ScrumDetails";
import ScrumForm from "../Scrum Details/ScrumForm";

const Dashboard = () => {
  const [scrumTeams, setScrumTeams] = useState([]);
  const [selectedScrumId, setSelectedScrumId] = useState(null);
  const [showScrumForm, setShowScrumForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get logged-in user

  useEffect(() => {
    axios
      .get("http://localhost:4000/scrums")
      .then((resp) => setScrumTeams(resp.data))
      .catch((error) => console.error("Error fetching scrums:", error));
  }, []);

  const handleGetDetails = (teamId) => {
    if (!user) {
      navigate("/login");
    } else {
      setSelectedScrumId(teamId);
      setShowScrumForm(false); // Hide form when viewing details
    }
  };

  const handleAddNewScrum = () => {
    setShowScrumForm(true);
    setSelectedScrumId(null); // Hide scrum details when adding a new scrum
  };

  return (
    <div>
      <h2>Scrum Teams</h2>

      {/* Show "Add New Scrum" button only if user is an admin */}
      {user?.role === "admin" && !showScrumForm && (
        <button onClick={handleAddNewScrum}>Add New Scrum</button>
      )}

      {/* Show Scrum Form when "Add New Scrum" is clicked */}
      {showScrumForm && <ScrumForm onClose={() => setShowScrumForm(false)} />}

      {/* List of Scrum Teams */}
      <ul>
        {scrumTeams.map((team) => (
          <li key={team.id}>
            {team.name}
            <button onClick={() => handleGetDetails(team.id)}>Get Details</button>
          </li>
        ))}
      </ul>

      {/* Show Scrum Details when a team is selected */}
      {selectedScrumId && <ScrumDetails scrumId={selectedScrumId} />}
    </div>
  );
};

export default Dashboard;
