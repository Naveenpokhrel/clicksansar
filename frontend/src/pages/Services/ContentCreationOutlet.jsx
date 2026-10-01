import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiZap, 
  FiCompass, 
  FiTarget, 
  FiCheck 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import outletContentCreation from '../../assets/outlet-content-creation.png';

const ContentCreationOutlet = ({ onBack }) => {
  const [contentType, setContentType] = useState('graphics');
  const [quantity, setQuantity] = useState('10');
  const [platform, setPlatform] = useState('instagram-facebook');
  const [estimatedCost, setEstimatedCost] = useState('8,000');

  const calculatePrice = () => {
    let perUnit = 800;
    if (contentType === 'carousel') perUnit = 1200;
    if (contentType === 'reels') perUnit = 1500;
    if (contentType === 'articles') perUnit = 1000;

    let count = Number(quantity) || 10;
    if (quantity === 'monthly') count = 30;

    let base = perUnit * count;
    if (platform === 'multi') base *= 1.25;

    setEstimatedCost(Math.round(base).toLocaleString());
  };

  const whatsappMessage = encodeURIComponent(
    'Hello Click Sansar, I am interested in your Content Creation service. I would like to discuss the details.'
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
          Social Media & Copywriting
        </span>
      </div>

      {/* Top Banner Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f4f8fc] rounded-3xl p-6 sm:p-10 border border-blue-100/60 shadow-sm">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1a66ff] text-xs font-bold">
            <FiEdit3 />
            <span>High-Converting Creative Content</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Engaging Graphics, Carousels & Copywriting
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Turn scrollers into paying customers. We produce eye-catching social media posts, brand carousels, and compelling ad copy designed to increase engagement and brand authority.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiZap className="text-blue-600" /> Creative Ideas
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiCompass className="text-blue-600" /> Trendy & Relevant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiTarget className="text-blue-600" /> Brand Focused
            </span>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl -z-10" />
            <img
              src={outletContentCreation}
              alt="Social Media Content Creation Mockup"
              className="w-full h-auto object-contain drop-shadow-lg select-none mix-blend-multiply"
            />
          </div>
        </div>
      </div>

      {/* Content Creation Calculator Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Form Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-left">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Content Creation Calculator
            </h3>

            {/* Select 1: Content Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="graphics">Social Media Graphics & Post Banners</option>
                <option value="carousel">Multi-slide Educational Carousels</option>
                <option value="reels">Short Form Vertical Reels & Scripting</option>
                <option value="articles">SEO Articles & Brand Copywriting</option>
              </select>
            </div>

            {/* Select 2: Quantity */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="5">5 Pieces of Content</option>
                <option value="10">10 Pieces of Content</option>
                <option value="20">20 Pieces of Content</option>
                <option value="monthly">Monthly Retainer (30+ Pieces)</option>
              </select>
            </div>

            {/* Select 3: Platform */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="instagram-facebook">Instagram & Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok-youtube">TikTok & YouTube Shorts</option>
                <option value="multi">Multi-Platform Optimization</option>
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
                <span>Get Custom Plan on WhatsApp</span>
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
                  (For selected quantity & platform)
                </span>
              </div>

              {/* What's Included */}
              <div className="space-y-3 pt-3 border-t border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  What's Included
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {[
                    'High-quality design & copy',
                    'Strategic captions & high-reach hashtags',
                    'Aspect ratio optimized for platform',
                    'Fast turnaround & delivery',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <FiCheck className="text-blue-600 font-bold flex-shrink-0" />
                      <span className="font-medium text-slate-600 text-xs sm:text-sm">
                        {item}
                      </span>
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
                <span>ORDER CONTENT PACKAGE</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-xs text-slate-400 mt-4 text-left">
          Note: Price may vary based on content type, quantity and complexity.
        </p>
      </div>
    </div>
  );
};

export default ContentCreationOutlet;
