import React, { useState, useEffect } from 'react';
import { getGallery, createGallery, deleteGallery } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import { FiPlus, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Office',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const { addToast } = useToast();

  const categories = ['Office', 'Team', 'Events', 'Clients', 'Campaigns'];

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await getGallery();
      setGallery(data || []);
    } catch (err) {
      console.error('Fetch gallery error:', err);
      addToast('Failed to load gallery images', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      category: 'Office',
      image: '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !formData.image) {
      addToast('Please upload an image file or provide an image URL', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('category', formData.category);

      if (imageFile) {
        dataToSubmit.append('image', imageFile);
      } else if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }

      await createGallery(dataToSubmit);
      addToast('New gallery image uploaded successfully!', 'success');

      setIsModalOpen(false);
      fetchGalleryItems();
    } catch (err) {
      console.error('Upload gallery error:', err);
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      setSubmitting(true);
      await deleteGallery(selectedItem._id);
      addToast('Gallery image removed!', 'success');
      setIsDeleteModalOpen(false);
      fetchGalleryItems();
    } catch (err) {
      console.error('Delete gallery item error:', err);
      addToast('Failed to delete gallery image', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = gallery.filter((item) => {
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gallery Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Upload and organize agency photos, team events, and office activities
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Upload New Image
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
            placeholder="Search gallery by caption or title..."
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
            Total: <strong className="text-slate-800">{filteredItems.length}</strong>
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiImage className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Gallery Photos</h3>
          <p className="text-xs text-slate-400 mt-1">Upload your first image to display in the website gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-48 bg-slate-100 overflow-hidden">
                <img
                  src={
                    item.image?.startsWith('http')
                      ? item.image
                      : `http://localhost:5000${item.image}`
                  }
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlay with details */}
              <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {item.title || 'Untitled Image'}
                  </h4>
                  <span className="text-[10px] text-blue-600 font-semibold uppercase">
                    {item.category || 'General'}
                  </span>
                </div>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Image"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload New Gallery Image"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Image Caption / Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Click Sansar Team Workshop 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

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
              Select Image File OR Image URL *
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
                placeholder="Or paste external image URL..."
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
              {submitting ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Image"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to remove this gallery image?
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
              {submitting ? 'Removing...' : 'Delete Image'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryManager;
