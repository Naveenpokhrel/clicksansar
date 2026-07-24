import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { getSettings } from '../../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Footer settings fetch error:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              <span className="text-blue-500">Click</span>
              <span>Sansar</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Click Sansar is Nepal's premier results-driven digital marketing agency. We specialize in social media growth, lead-generation advertising, video shoot, and custom web development.
          </p>
          <div className="flex gap-4 pt-2">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
                <FiFacebook size={18} />
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white transition-all">
                <FiInstagram size={18} />
              </a>
            )}
            {settings?.socialLinks?.linkedin && (
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-700 hover:text-white transition-all">
                <FiLinkedin size={18} />
              </a>
            )}
            {settings?.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all">
                <FiYoutube size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio Showcase</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing Packages</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Services Showcase */}
        <div>
          <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Our Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-white transition-colors">Meta Ads Marketing</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Social Media Management</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">SEO & Page Ranking</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Website Development</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Video Editing & Reels</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Corporate Branding</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs font-semibold">Contact Info</h4>
          <div className="flex items-start gap-3">
            <FiMapPin className="text-blue-500 mt-1 flex-shrink-0" size={18} />
            <span>{settings?.address || 'Mid-Baneshwor, Kathmandu, Nepal'}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiPhone className="text-blue-500 flex-shrink-0" size={17} />
            <a href={`tel:${settings?.phone || '+977-9800000000'}`} className="hover:text-white transition-colors">
              {settings?.phone || '+977-9800000000'}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-blue-500 flex-shrink-0" size={17} />
            <a href={`mailto:${settings?.email || 'info@clicksansar.com'}`} className="hover:text-white transition-colors">
              {settings?.email || 'info@clicksansar.com'}
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Click Sansar Digital Marketing Agency. All Rights Reserved.</p>
        <p className="mt-1">Designed for premium conversions and business growth across Nepal.</p>
      </div>
    </footer>
  );
};

export default Footer;
