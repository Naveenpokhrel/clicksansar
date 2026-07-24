import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiExternalLink, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-sm">
      {/* Left section: Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <FiMenu size={22} />
        </button>
        <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
          Control Panel &amp; Management System
        </span>
      </div>

      {/* Right section: Live Site Link & User Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Live Client Site link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200/60"
        >
          <span>View Live Site</span>
          <FiExternalLink />
        </a>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user?.username || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-500 capitalize leading-tight">
                {user?.role || 'Administrator'}
              </span>
            </div>
            <FiChevronDown className="text-slate-400 text-xs hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.username}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noopener noreferrer"
                className="flex sm:hidden items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <FiExternalLink /> Live Client Site
              </a>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
