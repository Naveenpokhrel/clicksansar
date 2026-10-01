import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingBag,
  FiFileText 
} from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import outletMetaAds from '../../assets/outlet-meta-ads.png';

const MetaAdsOutlet = ({ onBack }) => {
  // Minimum budget is $7
  const [dailyBudget, setDailyBudget] = useState(7);
  const [duration, setDuration] = useState(7);
  const [calculated, setCalculated] = useState({
    budget: 7,
    days: 7,
    totalCost: 49,
    dailyMinReach: 245,
    dailyMaxReach: 560,
    totalMinReach: 1715,
    totalMaxReach: 3920,
  });

  const handleCalculate = () => {
    const budgetVal = Math.max(7, Number(dailyBudget) || 7);
    const durationVal = Math.max(1, Number(duration) || 1);
    const totalCost = budgetVal * durationVal;
    const dailyMinReach = Math.round(budgetVal * 35);
    const dailyMaxReach = Math.round(budgetVal * 80);
    const totalMinReach = dailyMinReach * durationVal;
    const totalMaxReach = dailyMaxReach * durationVal;

    setCalculated({
      budget: budgetVal,
      days: durationVal,
      totalCost,
      dailyMinReach,
      dailyMaxReach,
      totalMinReach,
      totalMaxReach,
    });
  };

  // WhatsApp message formatted dynamically as requested
  const whatsappMessage = encodeURIComponent(
`Hello Click Sansar, I want to run a Meta Ads campaign.

Daily Budget: $${calculated.budget}
Campaign Duration: ${calculated.days} days
Total Ad Spend: $${calculated.totalCost}
Service: Meta Ads Boosting

Please help me start the campaign.`
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
          Digital Marketing & Meta Ads
        </span>
      </div>

      {/* Top Banner Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="lg:col-span-7 space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-blue-400/30">
            <FaFacebook className="text-blue-400 text-sm" />
            <FaInstagram className="text-pink-400 text-sm" />
            <span>Facebook & Instagram Ads</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Targeted Meta Ads & Instant Boosting Campaigns
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Maximize your ROAS with data-driven Meta campaigns. Reach thousands of active prospective buyers across Nepal and internationally with laser-focused demographic & interest targeting.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <FiUsers className="text-cyan-400" /> High-Intent Audience
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <FiTrendingUp className="text-emerald-400" /> Better Engagement
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <FiShoppingBag className="text-blue-400" /> Higher Sales
            </span>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center relative z-10">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl -z-10" />
            <img
              src={outletMetaAds}
              alt="Meta Ads Campaign Illustration"
              className="w-full h-auto object-contain drop-shadow-2xl select-none"
            />
          </div>
        </div>
      </div>

      {/* Meta Ads Calculator Section */}
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Form Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <FiDollarSign />
              </span>
              Meta Ads Calculator
            </h3>

            {/* Input 1: Daily Budget */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Daily Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiDollarSign size={18} />
                </span>
                <input
                  type="number"
                  min="7"
                  step="1"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm transition-all"
                  placeholder="7"
                />
              </div>
              <span className="block text-[11px] text-slate-400 font-medium">
                Minimum $7 per day
              </span>
            </div>

            {/* Input 2: Campaign Duration */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Campaign Duration (Days)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiCalendar size={18} />
                </span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-semibold text-sm transition-all"
                  placeholder="7"
                />
              </div>
              <span className="block text-[11px] text-slate-400 font-medium">
                Enter your desired campaign duration
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleCalculate}
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
                <span>Contact on WhatsApp / Run Campaign</span>
              </a>
            </div>
          </div>

          {/* Right Summary Box */}
          <div className="lg:col-span-5 bg-[#f4f8fc] rounded-2xl p-6 sm:p-8 border border-blue-100/60 shadow-sm flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FiFileText size={18} />
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Campaign Summary
                </h4>
              </div>

              <div className="space-y-3 text-sm text-slate-600 border-b border-blue-100 pb-5">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Daily Budget:</span>
                  <span className="font-bold text-slate-900">${calculated.budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Campaign Duration:</span>
                  <span className="font-bold text-slate-900">{calculated.days} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Estimated Daily Reach:</span>
                  <span className="font-bold text-slate-900">
                    {calculated.dailyMinReach.toLocaleString()} - {calculated.dailyMaxReach.toLocaleString()} people
                  </span>
                </div>
              </div>

              {/* Total Cost Display */}
              <div className="pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-extrabold text-slate-900">
                    Total Cost:
                  </span>
                  <span className="text-3xl font-black text-[#1a66ff]">
                    ${calculated.totalCost.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  (Total Estimated Reach: {calculated.totalMinReach.toLocaleString()} - {calculated.totalMaxReach.toLocaleString()} people)
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <FaWhatsapp className="text-white text-base" />
                <span>Contact on WhatsApp / Run Campaign</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <p className="text-xs text-slate-400 mt-4 text-left">
          Note: Results may vary based on targeting, audience and ad performance.
        </p>
      </div>
    </div>
  );
};

export default MetaAdsOutlet;
