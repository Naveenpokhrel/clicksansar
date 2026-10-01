import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiCode, 
  FiGlobe, 
  FiSmartphone, 
  FiZap, 
  FiCheck 
} from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiFlutter } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';

const WebDevOutlet = ({ onBack }) => {
  const [projectType, setProjectType] = useState('landing');
  const [features, setFeatures] = useState('standard');
  const [timeline, setTimeline] = useState('standard');
  const [estimatedCost, setEstimatedCost] = useState('15,000');

  const calculatePrice = () => {
    let base = 15000;
    if (projectType === 'business') base = 25000;
    if (projectType === 'ecommerce') base = 40000;
    if (projectType === 'webapp') base = 60000;
    if (projectType === 'mobile') base = 60000;

    if (features === 'cms') base += 5000;
    if (features === 'payment') base += 8000;
    if (features === 'custom') base += 15000;

    if (timeline === 'express') base += 5000;

    setEstimatedCost(base.toLocaleString());
  };

  const whatsappMessage = encodeURIComponent(
    'Hello Click Sansar, I am interested in your Website & App service. I would like to discuss the details.'
  );

  const whatsappUrl = `https://wa.me/9779800000000?text=${whatsappMessage}`;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* Back Button & Subheader */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1a66ff] transition-colors"
        >
          <FiArrowLeft size={18} />
          <span>Back to All Outlets</span>
        </button>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
          Software & App Engineering
        </span>
      </div>

      {/* Top Banner Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f4f8fc] rounded-3xl p-6 sm:p-10 border border-blue-100/60 shadow-sm">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1a66ff] text-xs font-bold">
            <FiCode />
            <span>Fast, Responsive & Scalable Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Custom Website & Mobile App Development
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We engineer high-performance web applications, e-commerce stores, custom CMS platforms, and cross-platform mobile apps tailored to grow your business.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiGlobe className="text-blue-600" /> Web Development
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiSmartphone className="text-blue-600" /> Mobile Apps
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiZap className="text-blue-600" /> Fast & Secure
            </span>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-blue-600">
                <SiReact size={30} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-sky-500">
                <SiFlutter size={26} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-blue-600">
                <FiGlobe size={26} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-800">
                Next-Gen Web & Mobile Stack
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                React, Vite, Node.js, Tailwind & Flutter Engineering
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Calculator Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Form Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-left">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Development Calculator
            </h3>

            {/* Select 1: Type of Project */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Type of Project
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="landing">Landing Page (Single Page Conversion)</option>
                <option value="business">Corporate / Business Website (Multi-Page)</option>
                <option value="ecommerce">E-Commerce Store (Products, Cart & Checkout)</option>
                <option value="webapp">Custom Web Application / SaaS Platform</option>
                <option value="mobile">Mobile App (Android & iOS)</option>
              </select>
            </div>

            {/* Select 2: Features */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Features
              </label>
              <select
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="standard">Standard Responsive Design & SEO</option>
                <option value="cms">Custom CMS & Admin Management Panel</option>
                <option value="payment">Local Online Payment Gateway (eSewa, Khalti)</option>
                <option value="custom">Advanced Integrations & Custom Database API</option>
              </select>
            </div>

            {/* Select 3: Timeline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Timeline
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="standard">Standard Delivery (2 - 3 Weeks)</option>
                <option value="express">Express Priority Delivery (1 - 2 Weeks)</option>
                <option value="comprehensive">Comprehensive Milestone Rollout (4 - 6 Weeks)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={calculatePrice}
                className="w-full bg-[#1a66ff] hover:bg-[#1554d1] text-white font-bold py-3.5 rounded-full text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
              >
                Calculate Price
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-full text-sm transition-all"
              >
                <FaWhatsapp className="text-emerald-500 text-lg" />
                <span>Get Custom Quote on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-5 bg-[#f4f8fc] rounded-2xl p-6 sm:p-8 border border-blue-100/60 shadow-sm flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Estimated Cost
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-slate-500">Starts from</span>
                  <span className="text-3xl font-black text-[#1a66ff]">
                    Rs. {estimatedCost}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  (Based on project selection)
                </span>
              </div>

              {/* Popular Packages */}
              <div className="space-y-3 pt-3 border-t border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Popular Packages
                </h4>
                <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700">
                  {[
                    { name: 'Landing Page', price: 'Rs. 15,000+' },
                    { name: 'Business Website', price: 'Rs. 25,000+' },
                    { name: 'E-Commerce Website', price: 'Rs. 40,000+' },
                    { name: 'Web Application', price: 'Rs. 60,000+' },
                    { name: 'Mobile App (Android/iOS)', price: 'Rs. 60,000+' },
                  ].map((pkg, i) => (
                    <li key={i} className="flex justify-between items-center py-1 border-b border-blue-50/80">
                      <span className="font-semibold text-slate-800">{pkg.name}</span>
                      <span className="font-bold text-blue-600">{pkg.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <FaWhatsapp className="text-emerald-400 text-base" />
                <span>REQUEST DEVELOPMENT PROJECT</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-xs text-slate-400 mt-4 text-left">
          Note: Final price may vary based on features, design and complexity.
        </p>
      </div>
    </div>
  );
};

export default WebDevOutlet;
