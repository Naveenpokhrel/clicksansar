import React, { useState, useEffect } from 'react';
import { getPortfolios } from '../../services/api';
import PortfolioCard from '../../components/PortfolioCard/PortfolioCard';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Branding', 'Advertising', 'Social Media', 'Video', 'Website', 'Photography'];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const data = await getPortfolios(activeCategory);
        setProjects(data);
      } catch (err) {
        console.error('Portfolio page load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [activeCategory]);

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Our Success Cases
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Explore our completed campaign advertisements, logo brands, short vertical videos, and custom engineered web platforms.
        </p>
      </section>

      {/* Filter Tabs */}
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

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <PortfolioCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No project items found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
