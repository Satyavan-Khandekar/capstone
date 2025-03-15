import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
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
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Redirect Logged-in Users Away from Login Page */}
          <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />

          {/* Protect Profile Route - Only Logged-in Users Can Access */}
          <Route path="/profiles" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

// Navigation Bar with Logout Functionality
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

// Protect Routes from Unauthenticated Users
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

// Redirect Logged-in Users Away from Login Page
const ProtectedAuthRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? <Navigate to="/" /> : children;
};

export default App;
