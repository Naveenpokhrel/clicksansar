import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiVideo, 
  FiEdit3, 
  FiCode, 
  FiMessageSquare, 
  FiFileText, 
  FiTrendingUp, 
  FiUsers, 
  FiBarChart2 
} from 'react-icons/fi';
import { FaCrown, FaCheck } from 'react-icons/fa';
import { SiMeta } from 'react-icons/si';
import { IoRocketOutline } from 'react-icons/io5';

import heroMockup from '../../assets/hero-mockup.png';
import whyWorkspace from '../../assets/why-workspace.png';

const Home = () => {
  const services = [
    {
      id: 'meta-ads',
      title: 'Meta Ads & Boosting',
      desc: 'Reach the right audience and promote your business with powerful Meta ads.',
      icon: <SiMeta size={24} />,
      iconBg: 'bg-[#2563eb]',
      textColor: 'text-[#2563eb]',
      cardBorder: 'hover:border-blue-200',
      link: '/services/meta-ads',
    },
    {
      id: 'video-shoot',
      title: 'Video Shoot & Editing',
      desc: "Professional videos and reels that tell your brand's story.",
      icon: <FiVideo size={22} />,
      iconBg: 'bg-[#f43f5e]',
      textColor: 'text-[#f43f5e]',
      cardBorder: 'hover:border-rose-200',
      link: '/services/video-shoot',
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      desc: "Engaging content designed for social media and your brand's growth.",
      icon: <FiEdit3 size={22} />,
      iconBg: 'bg-[#10b981]',
      textColor: 'text-[#10b981]',
      cardBorder: 'hover:border-emerald-200',
      link: '/services/content-creation',
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      desc: 'Digital subscription services for businesses and creators.',
      icon: <FaCrown size={20} />,
      iconBg: 'bg-[#8b5cf6]',
      textColor: 'text-[#8b5cf6]',
      cardBorder: 'hover:border-purple-200',
      link: '/services/subscriptions',
    },
    {
      id: 'web-dev',
      title: 'Website & App Development',
      desc: 'Modern websites and applications built for your needs.',
      icon: <FiCode size={22} />,
      iconBg: 'bg-[#f97316]',
      textColor: 'text-[#f97316]',
      cardBorder: 'hover:border-orange-200',
      link: '/services/web-dev',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discuss',
      desc: 'Share your goals and ideas with us.',
      icon: <FiMessageSquare size={20} />,
    },
    {
      step: '02',
      title: 'Plan',
      desc: 'We create a strategy that fits your needs.',
      icon: <FiFileText size={20} />,
    },
    {
      step: '03',
      title: 'Create',
      desc: 'Our team brings your vision to life.',
      icon: <FiVideo size={20} />,
    },
    {
      step: '04',
      title: 'Grow',
      desc: 'See real results and take your business forward.',
      icon: <FiBarChart2 size={20} />,
    },
  ];

  return (
    <div className="bg-white text-slate-900 overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[520px] h-[520px] bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  DIGITAL MARKETING AGENCY
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 leading-[1.14] tracking-tight mt-2">
                  Grow Your Business. <br />
                  <span className="text-[#1a66ff]">Go Digital.</span>
                </h1>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
                Click Sansar helps businesses grow through digital marketing, creative content, advertising and technology.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#1a66ff] hover:bg-[#1554d1] text-white font-semibold text-sm px-7 py-3 rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-200"
                >
                  <span>Get Started</span>
                  <FiArrowRight />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center font-medium text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-6 py-3 rounded-full transition-all duration-200 shadow-sm"
                >
                  View Services
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Laptop Mockup */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[560px]">
                <img
                  src={heroMockup}
                  alt="Click Sansar Digital Marketing Agency Laptop Mockup"
                  className="w-full h-auto object-contain select-none mix-blend-multiply drop-shadow-sm"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR SERVICES SECTION */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-left mb-12">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              What We Do
            </h2>
            <p className="text-slate-500 text-sm sm:text-[15px] mt-2 max-w-2xl">
              We offer complete digital solutions to help your brand grow, engage and succeed online.
            </p>
          </div>

          {/* 5 Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {services.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${item.cardBorder}`}
              >
                <div>
                  {/* Colored Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl ${item.iconBg} text-white flex items-center justify-center mb-6 shadow-sm`}
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-[16px] leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mt-3">
                    {item.desc}
                  </p>
                </div>

                {/* Arrow Link */}
                <div className="pt-6">
                  <span
                    className={`inline-flex items-center text-base font-bold ${item.textColor} group-hover:translate-x-1.5 transition-transform`}
                    aria-label={`Learn more about ${item.title}`}
                  >
                    <FiArrowRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHY CLICK SANSAR SECTION */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Soft ice-blue rounded card */}
          <div className="bg-[#f2f7fd] rounded-3xl p-6 sm:p-10 lg:p-12 border border-blue-100/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Heading & Checklist */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div>
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                    WHY CLICK SANSAR
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 leading-tight mt-1">
                    One place for your digital needs.
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mt-3">
                    We combine marketing, creative content and technology to help businesses build a stronger online presence.
                  </p>
                </div>

                {/* Checklist with circular checkmarks */}
                <ul className="space-y-3 pt-1">
                  {[
                    'Creative & Professional Team',
                    'Affordable Pricing',
                    'On-Time Delivery',
                    'Client Satisfaction',
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#1a66ff] text-white flex items-center justify-center flex-shrink-0">
                        <FaCheck size={9} />
                      </div>
                      <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Center Column: Desk Workspace Photo with Script badge */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-white">
                  <img
                    src={whyWorkspace}
                    alt="Click Sansar Creative Desk Setup with Laptop and Camera"
                    className="w-full h-[260px] sm:h-[280px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right Column: 3 Vertical Stats Cards */}
              <div className="lg:col-span-3 space-y-3.5">
                
                {/* Stat 1 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100/80 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiUsers size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">
                      Happy Clients
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      100+
                    </span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100/80 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FiFileText size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">
                      Projects Completed
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      150+
                    </span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100/80 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FiTrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">
                      Growth Focused
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Always
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. OUR PROCESS SECTION */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Header */}
          <div className="mb-14">
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              OUR PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Simple Steps to Success
            </h2>
            <p className="text-slate-500 text-sm sm:text-[15px] mt-2">
              We make the process easy, so you can focus on what you do best.
            </p>
          </div>

          {/* 4 Steps with connecting arrows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 relative">
            {processSteps.map((step, idx) => (
              <div key={step.step} className="flex flex-col items-center text-center relative group">
                
                {/* Circular Icon */}
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-[#1a66ff] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>

                {/* Step Number & Title */}
                <h3 className="font-extrabold text-slate-900 text-base">
                  {step.step} — {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mt-2 max-w-[210px]">
                  {step.desc}
                </p>

                {/* Connector Arrow for Desktop */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 -right-4 text-slate-300 transform -translate-y-1/2 pointer-events-none">
                    <FiArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-6 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#1a66ff] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-500/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white text-2xl flex-shrink-0">
                <IoRocketOutline />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Ready to take your business online?
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                  Let's build something that gets noticed.
                </p>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-white/50 text-xl font-light">
                ―&gt;
              </span>
              <Link
                to="/contact"
                className="bg-white hover:bg-slate-100 text-[#1a66ff] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-sm transition-all duration-200"
              >
                <span>Get Started</span>
                <FiArrowRight />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
