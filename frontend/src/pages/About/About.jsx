import React, { useState, useEffect } from 'react';
import { getTeam } from '../../services/api';
import TeamCard from '../../components/TeamCard/TeamCard';
import { FiTarget, FiEye, FiHeart, FiAward } from 'react-icons/fi';

const About = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teamData = await getTeam();
        setTeam(teamData);
      } catch (err) {
        console.error('About page team load error:', err);
      }
    };
    loadTeam();
  }, []);

  const values = [
    { title: 'Result-Oriented Focus', icon: <FiTarget size={24} className="text-blue-600" />, desc: 'We trace campaigns to real lead acquisitions and transactions.' },
    { title: 'Full Transparency', icon: <FiEye size={24} className="text-blue-600" />, desc: 'Clients get absolute visibility into daily advertising logs.' },
    { title: 'Creative Passion', icon: <FiHeart size={24} className="text-blue-600" />, desc: 'We script and design media vectors engineered to go viral.' },
    { title: 'High Integrity standards', icon: <FiAward size={24} className="text-blue-600" />, desc: 'Absolute safety, compliance, and custom codes in web engineering.' },
  ];

  return (
    <div className="pt-32 pb-20 space-y-24">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          About Click Sansar
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Scaling Brands in the Click World
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          We are a team of performance advertisers, cinematic videographers, branding specialists, and developers focused on building your online presence.
        </p>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">Our Journey</h2>
          <p className="text-slate-600 leading-relaxed">
            Click Sansar started with a clear vision: to bridge the gap between creative visual content and technical digital marketing. In Nepal, businesses often boost posts without structuring custom sales funnels or tracking pixel records.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We built a performance-driven agency where graphic visual styling, vertical video formats (TikTok/Reels), search optimizations, and blazing-fast custom websites work in sync. Today, we handle budgets and marketing workflows for consultancies, cafes, stores, and tech companies across the country.
          </p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            alt="Click Sansar team collaboration"
            className="rounded-3xl shadow-xl w-full max-h-[380px] object-cover border border-slate-100"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-16 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Mission */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <FiTarget size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To empower Nepalese and global businesses to maximize client leads and digital transactions by merging high-fidelity visual production with technical conversion frameworks.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <FiEye size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              To remain the most trusted, ROI-driven, and innovative digital agency in Nepal, famous for premium visual aesthetics, transparent client analytics reporting, and customized scaling pipelines.
            </p>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900">Our Core Principles</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            These guidelines outline how we approach creative briefs, client accounts, and performance tuning.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-lift text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-1">
                {v.icon}
              </div>
              <h4 className="font-bold text-slate-800 text-base">{v.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Members */}
      {team && team.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Meet Our Experts</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              The creative, marketing, and engineering minds behind our campaigns.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
