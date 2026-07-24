import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSettings } from '../../services/api';
import ContactForm from '../../components/ContactForm/ContactForm';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const location = useLocation();
  const preselected = location.state?.selectedService || '';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Contact page settings load error:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Contact Us
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Let's Plan Your Growth Strategy
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Have an inquiry or want to build a custom scaling budget? Write to us, schedule a call, or visit our office.
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info (4 cols) */}
        <div className="lg:col-span-4 space-y-8 text-left">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Get in Touch</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We look forward to partnering with your brand. Choose whatever channel fits your schedule.
            </p>
          </div>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FiMapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Physical Office</h4>
                <p className="text-slate-500 text-sm mt-1">
                  {settings?.address || 'Mid-Baneshwor, Kathmandu, Nepal'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FiPhone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Inquiry Phone Lines</h4>
                <p className="text-slate-500 text-sm mt-1">
                  <a href={`tel:${settings?.phone || '+977-9800000000'}`} className="hover:text-blue-600 transition-colors">
                    {settings?.phone || '+977-9800000000'}
                  </a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FiMail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Corporate Email</h4>
                <p className="text-slate-500 text-sm mt-1">
                  <a href={`mailto:${settings?.email || 'info@clicksansar.com'}`} className="hover:text-blue-600 transition-colors">
                    {settings?.email || 'info@clicksansar.com'}
                  </a>
                </p>
              </div>
            </div>

            {/* Work Hours */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FiClock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Business Work Hours</h4>
                <p className="text-slate-500 text-sm mt-1">
                  Sunday - Friday: 9:30 AM to 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Form (8 cols) */}
        <div className="lg:col-span-8">
          <ContactForm preselectedService={preselected} />
        </div>
      </section>

      {/* Map Embed Section */}
      {settings?.mapUrl && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-100">
            <iframe
              src={settings.mapUrl}
              title="Click Sansar Office Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;
