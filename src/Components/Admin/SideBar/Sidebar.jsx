import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFilePdf,
  FaUpload,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check if link is active
  const isActive = (path) => location.pathname === path;

  // Logout handler: clear localStorage and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("login");
    // You can clear all localStorage if needed:
    // localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-header">
        <h2 className="fs-4 fw-bold text-white">PDF Uploader</h2>
        <FaBars className="fs-4 text-white cursor-pointer" />
      </div>
      <div className="sidebar-content">
        <Link
          to="/"
          className={`sidebar-item ${isActive("/") ? "active" : ""}`}
        >
          <FaHome className="icon" />
          Dashboard
        </Link>
        <Link
          to="/pdf"
          className={`sidebar-item ${isActive("/pdf") ? "active" : ""}`}
        >
          <FaFilePdf className="icon" />
          PDF
        </Link>
        <Link
          to="/pdf-uploader"
          className={`sidebar-item ${
            isActive("/pdf-uploader") ? "active" : ""
          }`}
        >
          <FaUpload className="icon" />
          PDF Uploader
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-item btn-logout bg-transparent border-0 w-100"
          type="button"
        >
          <FaSignOutAlt className="icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
