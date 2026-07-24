import React, { useState, useEffect } from 'react';
import { getFAQs } from '../../services/api';
import FAQItem from '../../components/FAQ/FAQ';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await getFAQs();
        setFaqs(data);
      } catch (err) {
        console.error('FAQ page load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const categories = ['All', 'General', 'Services', 'Pricing'];

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory === 'All') return true;
    return f.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Quickly resolve queries regarding pricing models, service timelines, media ownership, and reporting channels.
        </p>
      </section>

      {/* Categories Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Accordions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredFaqs && filteredFaqs.length > 0 ? (
          <div className="space-y-4 text-left">
            {filteredFaqs.map((faq) => (
              <FAQItem key={faq._id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No FAQs found under this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FAQ;
