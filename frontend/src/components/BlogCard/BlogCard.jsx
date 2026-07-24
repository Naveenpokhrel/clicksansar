import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye, FiArrowRight } from 'react-icons/fi';

const BlogCard = ({ blog }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover-lift flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'}
          alt={blog.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {blog.category}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1">
              <FiCalendar />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <FiEye />
              {blog.views} Views
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
            {blog.excerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-6 mt-6 border-t border-slate-100/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">
            By {blog.author || 'Click Sansar'}
          </span>
          <Link
            to={`/blog/${blog.slug}`}
            className="text-xs font-bold text-blue-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            Read More
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
