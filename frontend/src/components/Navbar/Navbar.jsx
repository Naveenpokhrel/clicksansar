import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiKey, FiLogOut, FiChevronDown, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getSettings } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ClickSansarLogo from './ClickSansarLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Navbar settings fetch error:', err);
      }
    };
    fetchSettings();

    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const allNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappNumber = settings?.whatsapp || settings?.phone || '+9779800000000';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100'
          : 'bg-white/95 backdrop-blur-sm py-3.5 border-b border-slate-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ClickSansarLogo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {primaryNavLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[15px] font-medium transition-all relative py-1 ${
                    active
                      ? 'text-[#1a66ff] font-semibold'
                      : 'text-slate-600 hover:text-[#1a66ff]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1a66ff] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Click%20Sansar,%20I%20am%20interested%20in%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <FaWhatsapp className="text-base" />
              <span>WhatsApp</span>
            </a>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full pl-2 pr-3 py-1.5 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1a66ff] text-white flex items-center justify-center font-bold text-xs">
                    {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.fullName ? user.fullName.split(' ')[0] : user.username}
                  </span>
                  <FiChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fadeIn text-left">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/60 hover:text-[#1a66ff] transition-colors"
                    >
                      <FiKey size={14} className="text-[#1a66ff]" />
                      <span>My Orders & Product Keys</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <FiLogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-[#1a66ff] px-3 py-2 rounded-full transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-[#1a66ff] hover:bg-[#1554d1] text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-8 h-8 rounded-full bg-[#1a66ff] text-white flex items-center justify-center font-bold text-xs"
                title="Client Dashboard"
              >
                {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold text-blue-600 px-2.5 py-1 rounded-full bg-blue-50"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-5 pt-3 pb-6 animate-fadeIn">
          {isAuthenticated ? (
            <div className="mb-4 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-900">
                  {user.fullName || user.username}
                </p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-[#1a66ff] text-white text-xs font-bold rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center py-2.5 rounded-xl bg-[#1a66ff] text-white text-xs font-bold shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {allNavLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Click%20Sansar,%20I%20am%20interested%20in%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#22c55e] text-white py-2.5 rounded-full font-semibold text-sm shadow-sm"
            >
              <FaWhatsapp size={18} />
              <span>Chat on WhatsApp</span>
            </a>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full text-center py-2 text-xs font-bold text-rose-600 hover:underline"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
