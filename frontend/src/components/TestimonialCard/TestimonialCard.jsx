import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const count = Math.min(5, Math.max(1, rating || 5));
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`w-4 h-4 ${
            i < count ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Star Rating */}
        <div className="flex gap-1">
          {renderStars(testimonial.rating)}
        </div>

        {/* Review Content */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic">
          "{testimonial.review}"
        </p>
      </div>

      {/* Client Profile */}
      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={testimonial.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{testimonial.name}</h4>
          <p className="text-xs text-slate-400 font-semibold">
            {testimonial.role} {testimonial.company ? `at ${testimonial.company}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
