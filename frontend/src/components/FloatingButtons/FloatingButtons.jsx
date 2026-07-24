import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { getSettings } from '../../services/api';

const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Floating buttons settings fetch error:', err);
      }
    };
    fetchSettings();

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Format WhatsApp Link
  const rawPhone = settings?.phone || '9800000000';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('977') ? cleanPhone : '977' + cleanPhone}`;

  // Messenger URL
  const fbUrl = settings?.socialLinks?.facebook || 'https://facebook.com/clicksansar';
  const pageUsername = fbUrl.split('/').pop() || 'clicksansar';
  const messengerUrl = `https://m.me/${pageUsername}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>

      {/* Messenger Button */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        title="Chat on Messenger"
      >
        <FaFacebookMessenger size={22} />
      </a>

      {/* Scroll to Top */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-slate-900 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-bounce"
          title="Scroll to Top"
        >
          <FiArrowUp size={22} />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
