import React, { useState, useEffect } from 'react';
import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiImage,
  FiBriefcase,
  FiExternalLink,
  FiCalendar,
} from 'react-icons/fi';

const PortfolioManager = () => {
  const [portfolios, setPortfolios] = useState([]);
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
    category: 'Meta Ads',
    clientName: '',
    projectLink: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const { addToast } = useToast();

  const categories = [
    'Meta Ads',
    'Google Ads',
    'Branding',
    'Web Development',
    'Social Media',
    'SEO Campaign',
  ];

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const data = await getPortfolios();
      setPortfolios(data || []);
    } catch (err) {
      console.error('Fetch portfolio error:', err);
      addToast('Failed to load portfolio items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      category: 'Meta Ads',
      clientName: '',
      projectLink: '',
      description: '',
      image: '',
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Meta Ads',
      clientName: item.clientName || '',
      projectLink: item.projectLink || '',
      description: item.description || '',
      image: item.image || '',
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
    if (!formData.title || !formData.description) {
      addToast('Please enter title and description', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('category', formData.category);
      dataToSubmit.append('clientName', formData.clientName);
      dataToSubmit.append('projectLink', formData.projectLink);
      dataToSubmit.append('description', formData.description);

      if (imageFile) {
        dataToSubmit.append('image', imageFile);
      } else if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }

      if (selectedItem) {
        await updatePortfolio(selectedItem._id, dataToSubmit);
        addToast('Portfolio item updated successfully!', 'success');
      } else {
        await createPortfolio(dataToSubmit);
        addToast('New portfolio project added!', 'success');
      }

      setIsModalOpen(false);
      fetchPortfolios();
    } catch (err) {
      console.error('Save portfolio error:', err);
      addToast(err.response?.data?.message || 'Failed to save portfolio item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      setSubmitting(true);
      await deletePortfolio(selectedItem._id);
      addToast('Portfolio project deleted!', 'success');
      setIsDeleteModalOpen(false);
      fetchPortfolios();
    } catch (err) {
      console.error('Delete portfolio error:', err);
      addToast('Failed to delete portfolio project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = portfolios.filter((item) => {
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Showcase successful client campaigns, designs, and case studies
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Add Portfolio Project
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
            placeholder="Search projects by title, client, or details..."
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

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiBriefcase className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1">Add your first case study or reset search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={
                        item.image.startsWith('http')
                          ? item.image
                          : `http://localhost:5000${item.image}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FiImage size={32} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-600 text-white shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  {item.clientName && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      Client: {item.clientName}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">{item.description}</p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                {item.projectLink ? (
                  <a
                    href={item.projectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    <FiExternalLink /> Visit Link
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">No link</span>
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 5x ROAS Campaign for E-commerce Client"
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
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Apex Traders"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Project URL / Link
            </label>
            <input
              type="url"
              value={formData.projectLink}
              onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Project Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              placeholder="Describe campaign goals, strategies implemented, and results achieved..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Project Image (Upload or URL)
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
                placeholder="Or paste image URL"
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
              {submitting ? 'Saving...' : selectedItem ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Project"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete <strong>{selectedItem?.title}</strong>?
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
              {submitting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PortfolioManager;
