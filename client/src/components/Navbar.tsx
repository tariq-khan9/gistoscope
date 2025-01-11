// src/components/Navbar.tsx
import React from "react";
import { useGlobalContext } from "./context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout, googleLogin } = useGlobalContext();

  return (
    <nav className="navbar px-12 pt-2 bg-fuchsia-950 text-white h-12 flex flex-row justify-between space-x-4">
      <h1>Gistoscop</h1>
      <div className="flex flex-row space-x-4">
        <a href="#">Node</a>
        <a href="/">Home</a>
        <a href="/">Tree Page</a>
      </div>
      <div className="text-[14px] text-gray-300 flex flex-row justify-center items-center">
        {user ? (
          <div className="flex flex-row space-x-2 justify-center">
            <span>Welcome, {user.name}</span>
            <img
              className="w-8 h-8 rounded-full"
              src={user.image || "/profile.png"}
              alt="user"
            />

            <button>My Gists</button>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className="flex flex-row  space-x-2">
            <a href="/login" className="text-gray-100">
              Login
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
