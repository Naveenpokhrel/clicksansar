import React, { useState, useEffect } from 'react';
import { getBlogs } from '../../services/api';
import BlogCard from '../../components/BlogCard/BlogCard';
import { FiSearch } from 'react-icons/fi';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Advertising', 'Social Media', 'Website', 'Branding', 'SEO'];

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const data = await getBlogs(activeCategory, searchQuery);
        setBlogs(data);
      } catch (err) {
        console.error('Blog page load error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid spamming requests
    const timeoutId = setTimeout(() => {
      loadBlogs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Resources & Articles
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          The Click Sansar Blog
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Marketing insights, creative direction guides, and engineering tips written by our campaign managers.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-blue-500 text-sm bg-white"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
        </div>

        {/* Filter Categories */}
        <div className="md:col-span-8 flex flex-wrap gap-2 md:justify-end">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm">No articles matched your search queries.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
