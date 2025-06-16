// src/components/Navbar.tsx
import React from "react";
import { useGlobalContext } from "./context/AuthContext";
import Profile from "./auth/Profile";

const Navbar: React.FC = () => {
  const { user, logout, googleLogin } = useGlobalContext();

  return (
    <nav className="navbar font-quicksand font-semibold px-4 sm:px-6 md:px-12  bg-sky-900 text-white sm:h-14 flex flex-row items-center justify-between space-x-2 sm:space-x-4">
      <h1 className="hidden md:block font-light text-[20px] ">Gistoscope</h1>
      <div className="flex flex-row space-x-2 sm:space-x-4 text-[12px] sm:text-[14px] lg:text-[18px]">
        <a href="/#">Home</a>
        <div className="font-thin">|</div>
        <a href="/">Subjects</a>
        <div className="font-thin">|</div>
        <a href="/">Arithmetic</a>
        <div className="font-thin">|</div>
        <a href="/">Algebra</a>
      </div>
      <div className="text-[14px] text-gray-300 flex flex-row justify-center items-center">
        {user ? (
          <div className="flex flex-row space-x-2 items-center">
            <h1 className="hidden md:block">
              Welcome <span className="font-bold">{user?.name}</span>
            </h1>
            <Profile />
          </div>
        ) : (
          <div className="flex flex-row text-[12px] sm:text-[14px] space-x-2">
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
