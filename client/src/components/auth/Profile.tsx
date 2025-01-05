// src/components/Profile.tsx
import React from "react";
import { useGlobalContext } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user } = useGlobalContext();

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <h1>My Gists</h1>
    </div>
  );
};

export default Profile;
