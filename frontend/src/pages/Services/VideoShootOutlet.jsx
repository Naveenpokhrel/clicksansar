import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiVideo, 
  FiFilm, 
  FiCheck, 
  FiScissors, 
  FiLayers 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import outletVideoShoot from '../../assets/outlet-video-shoot.png';

const VideoShootOutlet = ({ onBack }) => {
  const [videoType, setVideoType] = useState('reels');
  const [duration, setDuration] = useState('under-60');
  const [revisions, setRevisions] = useState('1-2');
  const [estimatedCost, setEstimatedCost] = useState('5,000');

  const calculatePrice = () => {
    let base = 5000;
    if (videoType === 'promo') base += 5000;
    if (videoType === 'product') base += 3000;
    if (videoType === 'corporate') base += 10000;
    if (videoType === 'event') base += 8000;

    if (duration === '1-3') base += 3000;
    if (duration === '3-5') base += 6000;
    if (duration === '5plus') base += 12000;

    if (revisions === '3-4') base += 2000;
    if (revisions === 'unlimited') base += 5000;

    setEstimatedCost(base.toLocaleString());
  };

  const whatsappMessage = encodeURIComponent(
    'Hello Click Sansar, I am interested in your Video Shooting service. I would like to discuss the details.'
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
          Production & Editing
        </span>
      </div>

      {/* Top Banner Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f4f8fc] rounded-3xl p-6 sm:p-10 border border-blue-100/60 shadow-sm">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1a66ff] text-xs font-bold">
            <FiVideo />
            <span>4K Cinema & Drone Production</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            High-Impact Video Shooting & Post Production
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From viral social media Reels to high-end corporate ads, we shoot, edit, and color-grade videos that captivate your audience and elevate your brand presence.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiFilm className="text-blue-600" /> Professional 4K Gear
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiScissors className="text-blue-600" /> Creative Editing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <FiLayers className="text-blue-600" /> Reels & Shorts
            </span>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[440px]">
            <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl -z-10" />
            <img
              src={outletVideoShoot}
              alt="Video Production Camera and Editing Mockup"
              className="w-full h-auto object-contain drop-shadow-lg select-none mix-blend-multiply"
            />
          </div>
        </div>
      </div>

      {/* Video Service Calculator Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Form Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-left">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Video Service Calculator
            </h3>

            {/* Select 1: Type of Video */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Type of Video
              </label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="reels">Social Media Reels & Shorts</option>
                <option value="promo">Promotional Brand Commercial</option>
                <option value="product">Product Demo & Unboxing Shoot</option>
                <option value="corporate">Corporate Profile & Interview</option>
                <option value="event">Event Coverage & Highlight Reel</option>
              </select>
            </div>

            {/* Select 2: Video Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Video Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="under-60">Under 60 seconds (Shorts/Reel)</option>
                <option value="1-3">1 - 3 Minutes</option>
                <option value="3-5">3 - 5 Minutes</option>
                <option value="5plus">5+ Minutes (Full Feature)</option>
              </select>
            </div>

            {/* Select 3: Number of Revisions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Number of Revisions
              </label>
              <select
                value={revisions}
                onChange={(e) => setRevisions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm bg-white"
              >
                <option value="1-2">1 - 2 Revisions (Included)</option>
                <option value="3-4">3 - 4 Revisions (+ Rs. 2,000)</option>
                <option value="unlimited">Unlimited Revisions (+ Rs. 5,000)</option>
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
                  (Based on chosen parameters)
                </span>
              </div>

              {/* What's Included */}
              <div className="space-y-3 pt-3 border-t border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  What's Included
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {[
                    'Shooting (1 Day)',
                    'Professional Editing',
                    'Background Music & Sound Design',
                    'Color Correction & Grading',
                    '1-2 Revisions Included',
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
                <span>BOOK VIDEO SHOOT</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-xs text-slate-400 mt-4 text-left">
          Note: Final price may vary based on location, equipment and project complexity.
        </p>
      </div>
    </div>
  );
};

export default VideoShootOutlet;
