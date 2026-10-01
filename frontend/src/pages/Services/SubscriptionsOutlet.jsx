import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiHelpCircle, FiLock, FiCheck, FiShoppingBag, FiUserPlus, FiLogIn } from 'react-icons/fi';
import { FaCrown, FaWhatsapp } from 'react-icons/fa';
import PaymentModal from '../../components/PaymentModal/PaymentModal';

// Custom SVG Icons for Subscriptions
const CapCutIcon = () => (
  <svg className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v13C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-13C22 4.12 20.88 3 19.5 3zm-9 13.5v-9l7 4.5-7 4.5z" />
  </svg>
);

const CanvaIcon = () => (
  <svg className="w-7 h-7 text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z" />
  </svg>
);

const AdobeIcon = () => (
  <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.966 22H24V2h-10.034l.001 20zM0 22h10.033V2H0v20zm11.999-10.375L17.202 22h-3.414l-1.789-4.887h-4.001l4.002-5.488z" />
  </svg>
);

const OpenAIIcon = () => (
  <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.28 9.87a6.22 6.22 0 0 0-.53-5.26 6.3 6.3 0 0 0-6.72-3.07 6.24 6.24 0 0 0-4.9-2.54 6.3 6.3 0 0 0-6.14 4.5 6.23 6.23 0 0 0-4.43 3.2 6.3 6.3 0 0 0 .58 7.37 6.23 6.23 0 0 0 .53 5.26 6.3 6.3 0 0 0 6.72 3.07 6.23 6.23 0 0 0 4.9 2.54 6.3 6.3 0 0 0 6.14-4.5 6.23 6.23 0 0 0 4.43-3.2 6.3 6.3 0 0 0-.58-7.37zm-9.35 12.33a4.57 4.57 0 0 1-2.92-1.05l.15-.09 4.86-2.81a.84.84 0 0 0 .42-.73v-6.76l2.03 1.17a.82.82 0 0 1 .42.66v5.82a4.6 4.6 0 0 1-4.96 3.79z" />
  </svg>
);

const NotionIcon = () => (
  <svg className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.427.466l11.455-.746c.326 0 .046-.327-.047-.373L16.2.822c-.42-.373-.933-.56-1.586-.513L3.106 1.288c-.606.047-.793.327-.513.653zm.747 4.108v13.52c0 .84.42 1.167 1.26 1.12l13.565-.84c.793-.047 1.073-.466 1.073-1.167V7.476c0-.653-.326-.84-.933-.793l-13.939.84c-.653.046-1.026.326-1.026.793z" />
  </svg>
);

const SubscriptionsOutlet = ({ onBack }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Digital Subscription Products List
  const subscriptions = [
    {
      id: 'capcut-pro',
      name: 'CapCut Pro',
      desc: 'Premium video editing features & cloud templates.',
      priceNPR: 500,
      period: '1 Month',
      icon: <CapCutIcon />,
      iconBg: 'bg-slate-100',
    },
    {
      id: 'chatgpt-plus',
      name: 'ChatGPT Plus (GPT-4o)',
      desc: 'Access GPT-4o, DALL-E 3 & priority speeds.',
      priceNPR: 2800,
      period: '1 Month',
      icon: <OpenAIIcon />,
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'claude-pro',
      name: 'Claude Pro',
      desc: 'Advanced AI coding, analysis & 5x usage limits.',
      priceNPR: 2800,
      period: '1 Month',
      icon: <OpenAIIcon />,
      iconBg: 'bg-[#f4f8fc]',
    },
    {
      id: 'canva-pro',
      name: 'Canva Pro',
      desc: 'Design anything with premium templates & brand kit.',
      priceNPR: 750,
      period: '1 Month',
      icon: <CanvaIcon />,
      iconBg: 'bg-cyan-50',
    },
    {
      id: 'adobe-cc',
      name: 'Adobe Creative Cloud',
      desc: 'Photoshop, Illustrator, Premiere Pro & 20+ apps.',
      priceNPR: 4500,
      period: '1 Month',
      icon: <AdobeIcon />,
      iconBg: 'bg-red-50',
    },
    {
      id: 'notion-pro',
      name: 'Notion Pro',
      desc: 'All-in-one workspace for notes, docs and planning.',
      priceNPR: 1200,
      period: '1 Month',
      icon: <NotionIcon />,
      iconBg: 'bg-slate-100',
    },
  ];

  // Handle Buy Now Click
  const handleBuyNow = (sub) => {
    setSelectedProduct(sub);

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 text-left font-sans">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1a66ff] transition-colors py-1 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>
      </div>

      {/* Hero Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#1a66ff] text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20">
            <FaCrown />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
            Digital Subscription <span className="text-[#1a66ff]">Marketplace</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Get instant access to genuine digital subscriptions, AI tools, and creative software with 100% verified eSewa payment & admin approval.
          </p>
        </div>

        {/* Right Graphic Mockup */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[420px] bg-[#f4f8fc] rounded-3xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <OpenAIIcon />
              </span>
              <span className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <AdobeIcon />
              </span>
              <span className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <CanvaIcon />
              </span>
              <span className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <NotionIcon />
              </span>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 bg-blue-100/60 text-[#1a66ff] text-xs font-bold rounded-full">
                eSewa QR Payment • Verified Admin Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Products Grid */}
      <div className="pt-2 space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Available Digital Subscriptions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${sub.iconBg} flex items-center justify-center`}>
                    {sub.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 text-[#1a66ff] rounded-lg text-xs font-bold border border-blue-100">
                    {sub.period}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-lg">
                  {sub.name}
                </h4>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-[36px]">
                  {sub.desc}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Fixed Price:
                  </span>
                  <span className="text-2xl font-black text-[#1a66ff]">
                    NPR {sub.priceNPR.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => handleBuyNow(sub)}
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold py-3.5 rounded-xl bg-[#1a66ff] hover:bg-[#1554d1] text-white transition-all shadow-md shadow-blue-500/20"
                >
                  <FiShoppingBag size={14} />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Gate Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-center space-y-5 animate-fadeIn">
            <div className="w-14 h-14 bg-blue-50 text-[#1a66ff] rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FiLock />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Authentication Required</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Please login or create an account to continue purchasing <span className="font-bold text-slate-900">{selectedProduct?.name}</span>.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login', { state: { from: '/services' } });
                }}
                className="w-full py-3 bg-[#1a66ff] hover:bg-[#1554d1] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <FiLogIn />
                <span>Login to Existing Account</span>
              </button>

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/register', { state: { from: '/services' } });
                }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <FiUserPlus />
                <span>Create New Account</span>
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="text-xs text-slate-400 font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderData={{
          title: `${selectedProduct?.name} (${selectedProduct?.period})`,
          totalNPR: selectedProduct?.priceNPR,
          totalCost: selectedProduct?.priceNPR,
          details: `Digital Subscription: ${selectedProduct?.name} - Duration: ${selectedProduct?.period}`,
        }}
      />
    </div>
  );
};

export default SubscriptionsOutlet;
