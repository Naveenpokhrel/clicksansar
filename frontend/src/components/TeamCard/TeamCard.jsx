import React from 'react';
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

const TeamCard = ({ member }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover-lift flex flex-col h-full items-center text-center p-6">
      {/* Profile Photo */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 mb-5 relative group">
        <img
          src={member.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="space-y-1 mb-4 flex-1">
        <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide text-xs">
          {member.role}
        </p>
        {member.bio && (
          <p className="text-slate-500 text-sm leading-relaxed mt-3 px-2 line-clamp-3">
            {member.bio}
          </p>
        )}
      </div>

      {/* Social Links */}
      <div className="flex gap-3 justify-center pt-2">
        {member.socialLinks?.facebook && (
          <a
            href={member.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center border border-slate-100 shadow-sm transition-all"
          >
            <FiFacebook size={15} />
          </a>
        )}
        {member.socialLinks?.instagram && (
          <a
            href={member.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white hover:bg-pink-600 hover:text-white text-slate-500 flex items-center justify-center border border-slate-100 shadow-sm transition-all"
          >
            <FiInstagram size={15} />
          </a>
        )}
        {member.socialLinks?.linkedin && (
          <a
            href={member.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white hover:bg-blue-700 hover:text-white text-slate-500 flex items-center justify-center border border-slate-100 shadow-sm transition-all"
          >
            <FiLinkedin size={15} />
          </a>
        )}
        {member.socialLinks?.twitter && (
          <a
            href={member.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-950 hover:text-white text-slate-500 flex items-center justify-center border border-slate-100 shadow-sm transition-all"
          >
            <FiTwitter size={15} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
