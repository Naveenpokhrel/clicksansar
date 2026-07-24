import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogBySlug } from '../../services/api';
import { FiArrowLeft, FiCalendar, FiEye, FiUser } from 'react-icons/fi';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlogDetail = async () => {
      setLoading(true);
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error('Blog details load error:', err);
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };
    loadBlogDetail();
  }, [slug]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-slate-500 text-sm">The blog post you are looking for might have been removed or renamed.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-indigo-600">
          <FiArrowLeft /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Back link */}
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold mb-6"
      >
        <FiArrowLeft /> Back to Articles
      </button>

      {/* Header Info */}
      <div className="space-y-4 text-left">
        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {blog.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-5 text-slate-400 text-xs sm:text-sm font-medium border-y border-slate-100 py-3">
          <span className="flex items-center gap-2">
            <FiUser className="text-blue-600" />
            By {blog.author || 'Click Sansar'}
          </span>
          <span className="flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-2">
            <FiEye className="text-blue-600" />
            {blog.views} Reads
          </span>
        </div>
      </div>

      {/* Main Image */}
      <div className="my-8 aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blog Body Content */}
      <article
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-left text-sm sm:text-base space-y-4"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogDetail;
