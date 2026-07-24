import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

export const IconRenderer = ({ iconName, className }) => {
  const IconComponent = FiIcons[iconName] || FiIcons.FiCheckCircle;
  return <IconComponent className={className} />;
};

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl hover-lift flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <IconRenderer iconName={service.icon} className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed">
          {service.shortDescription}
        </p>
      </div>

      {/* Button */}
      <div className="pt-6 mt-auto">
        <Link
          to={`/services#${service.slug}`}
          className="text-sm font-semibold text-blue-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
        >
          Learn More
          <FiIcons.FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
