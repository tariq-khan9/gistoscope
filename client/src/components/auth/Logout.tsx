// src/components/Logout.tsx
import React from "react";
import { useGlobalContext } from "../context/AuthContext";

const Logout: React.FC = () => {
  const { logout } = useGlobalContext();

  return <button onClick={logout}>Logout</button>;
};

export default Logout;
