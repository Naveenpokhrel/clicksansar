import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

const PricingCard = ({ plan }) => {
  return (
    <div
      className={`bg-white border rounded-3xl p-8 flex flex-col justify-between h-full relative transition-all duration-300 ${
        plan.popular
          ? 'border-blue-500 shadow-xl scale-105 z-10'
          : 'border-slate-100 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Popular tag */}
      {plan.popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Most Popular
        </span>
      )}

      <div>
        {/* Header */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {plan.price}
            </span>
            {plan.period && (
              <span className="text-slate-400 text-sm font-semibold">
                /{plan.period}
              </span>
            )}
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-0.5 flex-shrink-0">
                <FiCheck size={13} />
              </span>
              <span className="leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <Link
        to="/contact"
        state={{ selectedService: plan.name }}
        className={`w-full text-center py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
          plan.popular
            ? 'blue-gradient shadow-md shadow-blue-500/20 text-white'
            : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
        }`}
      >
        {plan.buttonText || 'Choose Plan'}
      </Link>
    </div>
  );
};

export default PricingCard;
