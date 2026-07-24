import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import { getSettings } from '../../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-slate-700 hover:text-blue-600 transition-colors font-medium';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center">
              <span className="text-blue-600">Click</span>
              <span className="text-slate-800 ml-1">Sansar</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={isActive(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${settings?.phone || '+977-9800000000'}`}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              <FiPhone className="text-blue-600" />
              <span>Call Us</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full text-sm font-semibold blue-gradient shadow-md shadow-blue-500/10 hover:shadow-lg transition-all"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-blue-600 transition-colors p-1"
            >
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 shadow-inner">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 px-3">
              <a
                href={`tel:${settings?.phone || '+977-9800000000'}`}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 py-1"
              >
                <FiPhone />
                <span>Call: {settings?.phone || '+977-9800000000'}</span>
              </a>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-full text-white font-semibold blue-gradient"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
