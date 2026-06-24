import React from "react";
import { Navigate } from "react-router-dom";

// Gate admin pages behind a stored JWT. The token is verified server-side on
// every /api/admin call; this is just a client-side redirect for UX.
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("cookit_admin_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
