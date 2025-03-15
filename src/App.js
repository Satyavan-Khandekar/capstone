import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { UserProvider, UserContext } from "./context/UserContext"; 
import Dashboard from "./component/Dashboard/Dashboard";
import Login from "./component/Login/Login";
import SignUp from "./component/Signup/SignUp";
import UserProfile from "./component/UserProfile/UserProfile";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profiles" element={<UserProfile />} />

        </Routes>
      </Router>
    </UserProvider>
  );
};

const Nav = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        {user ? (
          <>
            <li><Link to="/profiles">Profiles</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default App;
