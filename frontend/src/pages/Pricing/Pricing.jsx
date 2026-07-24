import React, { useState, useEffect } from 'react';
import { getPricing, getFAQs } from '../../services/api';
import PricingCard from '../../components/PricingCard/PricingCard';
import FAQ from '../../components/FAQ/FAQ';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const [pricingData, faqData] = await Promise.all([getPricing(), getFAQs()]);
        setPlans(pricingData);
        // Filter FAQs related to pricing
        const pricingFaqs = faqData.filter(
          (f) => f.category?.toLowerCase() === 'pricing' || f.category?.toLowerCase() === 'general'
        );
        setFaqs(pricingFaqs);
      } catch (err) {
        console.error('Pricing page data load error:', err);
      }
    };
    loadPricingData();
  }, []);

  return (
    <div className="pt-32 pb-20 space-y-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Pricing Plans
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Transparent, ROI-Driven Rates
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Choose from our pre-defined packages or contact us to build a custom marketing and content campaign tailored to your business scale.
        </p>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard key={plan._id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No pricing packages found. Contact us for custom rates!</p>
          </div>
        )}
      </section>

      {/* Pricing FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Pricing FAQs</h2>
            <p className="text-slate-500 text-sm">
              Answers to standard questions regarding campaign setups, billing terms, and budget handling.
            </p>
          </div>
          <div className="space-y-4 text-left">
            {faqs.map((faq) => (
              <FAQ key={faq._id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Pricing;
