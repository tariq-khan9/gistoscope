import React, { useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import OutsideClickHandler from "react-outside-click-handler"; // Import the library

const Profile = () => {
  const { user, logout } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={closeDropdown}>
        <img
          className=" w-6 h-6 md:w-8 md:h-8 rounded-full cursor-pointer"
          src={user?.image || "/profile.png"}
          alt="user"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 text-[12px] md:text-[14px] w-36 md:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1 px-4 space-y-2 md:space-y-4">
              <a
                href={`/user/${user?.name}/${user?.id}`}
                className="block  text-gray-700 hover:bg-gray-100"
              >
                My Gists
              </a>
              <a
                href="/my-favorites"
                className="block   text-gray-700 hover:bg-gray-100"
              >
                My Favorites
              </a>
              <button
                onClick={logout}
                className="block w-full text-left   text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default Profile;
