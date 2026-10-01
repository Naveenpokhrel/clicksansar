import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { getSettings } from '../../services/api';
import ClickSansarLogo from '../Navbar/ClickSansarLogo';

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

  const whatsappNumber = settings?.whatsapp || settings?.phone || '+9779800000000';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0b0f19] text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/">
              <ClickSansarLogo dark={true} />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-7 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* WhatsApp CTA & Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Click%20Sansar`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-emerald-500/60 bg-emerald-950/20 text-slate-200 hover:text-white hover:bg-emerald-900/40 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            >
              <FaWhatsapp className="text-emerald-400 text-sm" />
              <span>Chat on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2.5 text-slate-400">
              <a
                href={settings?.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-xs"
                title="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={settings?.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-xs"
                title="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={settings?.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-xs"
                title="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href={settings?.socialLinks?.twitter || 'https://x.com'}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all text-xs"
                title="X"
              >
                <FaXTwitter />
              </a>
            </div>
          </div>

        </div>

        {/* Sub-bar: Core offerings tagline */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p className="tracking-wide">
            Digital Marketing &nbsp;|&nbsp; Creative Content &nbsp;|&nbsp; Technology
          </p>
          <p>
            &copy; 2025 Click Sansar. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
