import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/api';
import { useToast } from '../components/Toast';
import {
  FiSettings,
  FiSave,
  FiGlobe,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiMessageSquare,
} from 'react-icons/fi';

const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'Click Sansar',
    email: 'info@clicksansar.com',
    phone: '+977-9800000000',
    address: 'Kathmandu, Nepal',
    mapUrl: '',
    logo: '',
    chatbotWelcome: 'Hello! Welcome to Click Sansar. How can we help your business grow today?',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  });
  const [logoFile, setLogoFile] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        if (data) {
          setFormData({
            companyName: data.companyName || 'Click Sansar',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            mapUrl: data.mapUrl || '',
            logo: data.logo || '',
            chatbotWelcome:
              data.chatbotWelcome ||
              'Hello! Welcome to Click Sansar. How can we help your business grow today?',
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            linkedin: data.socialLinks?.linkedin || '',
            twitter: data.socialLinks?.twitter || '',
          });
        }
      } catch (err) {
        console.error('Fetch settings error:', err);
        addToast('Failed to load website settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('companyName', formData.companyName);
      dataToSubmit.append('email', formData.email);
      dataToSubmit.append('phone', formData.phone);
      dataToSubmit.append('address', formData.address);
      dataToSubmit.append('mapUrl', formData.mapUrl);
      dataToSubmit.append('chatbotWelcome', formData.chatbotWelcome);
      dataToSubmit.append(
        'socialLinks',
        JSON.stringify({
          facebook: formData.facebook,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        })
      );

      if (logoFile) {
        dataToSubmit.append('logo', logoFile);
      } else if (formData.logo) {
        dataToSubmit.append('logo', formData.logo);
      }

      await updateSettings(dataToSubmit);
      addToast('Website settings updated successfully!', 'success');
    } catch (err) {
      console.error('Save settings error:', err);
      addToast('Failed to update website settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Website Settings
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Global branding, contact details, social links, and AI chatbot configuration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General & Contact Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FiGlobe className="text-blue-600" /> General Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Company / Agency Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Office Location Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Logo (Upload Image or URL)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="Or paste logo image URL"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FiFacebook className="text-blue-600" /> Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                LinkedIn Company URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Chatbot & Extra Settings */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FiMessageSquare className="text-blue-600" /> AI Assistant &amp; Map Settings
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Chatbot Greeting Message
            </label>
            <textarea
              value={formData.chatbotWelcome}
              onChange={(e) => setFormData({ ...formData, chatbotWelcome: e.target.value })}
              rows="2"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            <FiSave size={16} />
            <span>{submitting ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
