import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

const PortfolioCard = ({ project }) => {
  return (
    <div className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover-lift flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
        <img
          src={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Overlay Badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100/55 shadow-sm">
          {project.category}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-2">
          {project.clientName && (
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Client: {project.clientName}
            </span>
          )}
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Action Link */}
        {project.projectLink && project.projectLink !== '#' && (
          <div className="pt-4 border-t border-slate-100/80 mt-4 flex items-center justify-end">
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              Visit Project
              <FiExternalLink />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
