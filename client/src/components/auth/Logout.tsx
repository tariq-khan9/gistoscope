// src/components/Logout.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Logout: React.FC = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
};

export default Logout;
