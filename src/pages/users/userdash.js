import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";

function Userdash() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userInitial = userData?.firstName?.charAt(0).toUpperCase() || "?";

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        logoutUser();
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
  
    window.addEventListener("popstate", handleBackButton);
    window.history.pushState(null, null, window.location.pathname);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [logoutUser]); // Add logoutUser here
  

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("userData");
    navigate("/login", { state: { message: "You have been logged out" } });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        {/* Left: Profile Circle */}
        <div className="profile-circle" onClick={() => setMenuOpen(!menuOpen)}>
          {userInitial}
        </div>

        {/* Right: Logo (Click to Go Home) */}
        <img 
          src="https://via.placeholder.com/100x40?text=Logo" 
          alt="Logo" 
          className="dashboard-logo" 
          onClick={() => navigate("/")} 
        />

        {/* Profile Dropdown Menu */}
        {menuOpen && (
          <div className="profile-menu">
            <button className="close-menu" onClick={() => setMenuOpen(false)}>×</button>
            <p className="user-name">{userData?.firstName} {userData?.lastName}</p>
            <p className="user-email">{userData?.email}</p>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        )}
      </header>

      {/* Greeting */}
      <h2 className="greeting">{greeting}, {userData?.firstName}!</h2>

      {/* Courses Section */}
      <div className="courses-container">
        <div className="course-card">
          <img src="https://source.unsplash.com/400x250/?quran" alt="Quran Course" />
          <h3>Basic Quran Reading</h3>
          <p>Learn to read the Quran with correct pronunciation.</p>
        </div>

        <div className="course-card">
          <img src="https://source.unsplash.com/400x250/?islamic" alt="Tajweed Course" />
          <h3>Tajweed Course</h3>
          <p>Enhance your Quran recitation with proper Tajweed rules.</p>
        </div>

        <div className="course-card">
          <img src="https://source.unsplash.com/400x250/?mosque" alt="Memorization Course" />
          <h3>Quran Memorization</h3>
          <p>Start your journey to memorizing the Quran with expert guidance.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        QuranPilot E-learning
      </footer>
    </div>
  );
}

export default Userdash;
