import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getServices } from '../../services/api';
import { IconRenderer } from '../../components/ServiceCard/ServiceCard';
import { FiCheckCircle } from 'react-icons/fi';

const Services = () => {
  const [services, setServices] = useState([]);
  const { hash } = useLocation();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Services page load error:', err);
      }
    };
    loadServices();
  }, []);

  // Handle scroll to hash anchor on mount/update
  useEffect(() => {
    if (hash && services.length > 0) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [hash, services]);

  return (
    <div className="pt-32 pb-20 space-y-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Our Services
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Professional Digital Growth Solutions
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          From target Meta campaigns and short reels script shoot, to fast React codes and Google ranking optimizations.
        </p>
      </section>

      {/* Services List Detail cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {services.map((service, idx) => (
          <div
            key={service._id}
            id={service.slug}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-slate-100 ${
              idx === 0 ? 'border-t-0 pt-0' : ''
            }`}
          >
            {/* Image (alternate left/right grid cols order) */}
            <div
              className={`lg:col-span-5 ${
                idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <img
                src={service.image || 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80'}
                alt={service.title}
                className="rounded-3xl shadow-lg w-full max-h-[350px] object-cover border border-slate-100/50"
                loading="lazy"
              />
            </div>

            {/* Content info */}
            <div
              className={`lg:col-span-7 space-y-6 text-left ${
                idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <IconRenderer iconName={service.icon} className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {service.title}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {service.detailedDescription}
              </p>

              {/* Benefits */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-slate-900 font-bold text-sm tracking-wide uppercase">Why This Matters:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {service.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA link */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  state={{ selectedService: service.title }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider blue-gradient text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all"
                >
                  Inquire about {service.title}
                </Link>
              </div>
            </div>

          </div>
        ))}
      </section>
    </div>
  );
};

export default Services;
