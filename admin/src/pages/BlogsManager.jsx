import React, { useState, useEffect } from 'react';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiImage,
  FiFileText,
  FiEye,
} from 'react-icons/fi';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Digital Marketing',
    author: 'Click Sansar',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const { addToast } = useToast();

  const categories = [
    'Digital Marketing',
    'Social Media',
    'SEO & Content',
    'Branding & Design',
    'Web Development',
    'Business Growth',
  ];

  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error('Fetch blogs error:', err);
      addToast('Failed to load blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const openCreateModal = () => {
    setSelectedBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Digital Marketing',
      author: 'Click Sansar',
      image: '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || 'Digital Marketing',
      author: blog.author || 'Click Sansar',
      image: blog.image || '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      addToast('Please fill in title and content', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('excerpt', formData.excerpt);
      dataToSubmit.append('content', formData.content);
      dataToSubmit.append('category', formData.category);
      dataToSubmit.append('author', formData.author);

      if (imageFile) {
        dataToSubmit.append('image', imageFile);
      } else if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }

      if (selectedBlog) {
        await updateBlog(selectedBlog._id, dataToSubmit);
        addToast('Blog post updated successfully!', 'success');
      } else {
        await createBlog(dataToSubmit);
        addToast('New blog post published successfully!', 'success');
      }

      setIsModalOpen(false);
      fetchBlogsData();
    } catch (err) {
      console.error('Save blog error:', err);
      addToast(err.response?.data?.message || 'Failed to save blog post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    try {
      setSubmitting(true);
      await deleteBlog(selectedBlog._id);
      addToast('Blog post deleted successfully!', 'success');
      setIsDeleteModalOpen(false);
      fetchBlogsData();
    } catch (err) {
      console.error('Delete blog error:', err);
      addToast('Failed to delete blog post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      categoryFilter === 'All' || b.category === categoryFilter;
    const matchesSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Blog Posts Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Write, edit, or delete insights, news, and digital marketing guides
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Create New Blog Post
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or snippet..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs font-medium text-slate-500">
            Count: <strong className="text-slate-800">{filteredBlogs.length}</strong>
          </span>
        </div>
      </div>

      {/* Blogs Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiFileText className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Blog Posts Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try publishing a new blog post or changing filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Article</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Author</th>
                  <th className="py-3.5 px-6">Views</th>
                  <th className="py-3.5 px-6">Published</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          {blog.image ? (
                            <img
                              src={
                                blog.image.startsWith('http')
                                  ? blog.image
                                  : `http://localhost:5000${blog.image}`
                              }
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FiImage size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">{blog.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-semibold text-[11px]">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{blog.author || 'Click Sansar'}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <FiEye className="text-slate-400" /> {blog.views || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Blog"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Blog"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBlog ? 'Edit Blog Post' : 'Publish New Blog Post'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 10 Essential Meta Ad Strategies for Local Businesses"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Click Sansar Team"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Excerpt / Summary
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows="2"
              placeholder="Short introductory snippet for card previews..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Article Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="6"
              placeholder="Write or paste full article body markdown / text..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
              required
            />
          </div>

          {/* Image Upload or URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Cover Image (File Upload or URL)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or paste image URL (e.g. Unsplash URL)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : selectedBlog ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Blog Post"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete <strong>{selectedBlog?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogsManager;
