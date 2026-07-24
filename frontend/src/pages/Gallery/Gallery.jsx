import React, { useState, useEffect } from 'react';
import { getGallery } from '../../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Office', 'Events', 'Campaigns'];

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const data = await getGallery(activeCategory);
        setItems(data);
      } catch (err) {
        console.error('Gallery page load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, [activeCategory]);

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Photo Gallery
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Life at Click Sansar
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Snapshots of our office atmosphere, client campaign shoots, strategic brainstorm sessions, and corporate milestone parties.
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

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative overflow-hidden aspect-[4/3] rounded-3xl bg-slate-100 shadow-md border border-slate-100/50"
              >
                <img
                  src={item.image}
                  alt={item.title || 'Click Sansar Gallery'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Visual Overlay Caption on Hover */}
                {item.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end p-6 transition-all duration-300">
                    <p className="text-white text-sm font-bold text-left leading-snug">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No photos found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
