import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage or any user session data
    localStorage.removeItem("userData");
    setUser(null);
    // Redirect to the homepage after logout
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h2>Welcome, {user?.username || "User"}!</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;