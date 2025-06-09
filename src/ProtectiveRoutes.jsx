import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectiveRoutes = () => {
  const loginData = localStorage.getItem("login");

  // If not logged in, redirect to login
  if (!loginData) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the child components (nested routes)
  return <Outlet />;
};

export default ProtectiveRoutes;
