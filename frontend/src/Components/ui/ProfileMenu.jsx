import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const ProfileMenu = ({ username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const initial = username?.[0]?.toUpperCase() || "?";

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold flex items-center justify-center shadow-md hover:scale-105 transition"
      >
        {initial}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transform transition-all duration-200 ${
          menuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="font-semibold text-gray-800 truncate">{username}</p>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition">
            <FontAwesomeIcon icon={faUser} />
            Profile
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition">
            <FontAwesomeIcon icon={faGear} />
            Settings
          </button>

          <div className="border-t my-2"></div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-100 text-red-500 transition"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
