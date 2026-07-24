import React, { useState, useEffect } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiImage,
  FiCheck,
  FiLayers,
} from 'react-icons/fi';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    icon: 'FiTarget',
    shortDescription: '',
    detailedDescription: '',
    benefits: [''],
    image: '',
    status: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const { addToast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data || []);
    } catch (err) {
      console.error('Fetch services error:', err);
      addToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setSelectedService(null);
    setFormData({
      title: '',
      icon: 'FiTarget',
      shortDescription: '',
      detailedDescription: '',
      benefits: ['High ROI', 'Custom Strategy'],
      image: '',
      status: true,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title || '',
      icon: service.icon || 'FiTarget',
      shortDescription: service.shortDescription || '',
      detailedDescription: service.detailedDescription || '',
      benefits: service.benefits && service.benefits.length > 0 ? service.benefits : [''],
      image: service.image || '',
      status: service.status !== undefined ? service.status : true,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleBenefitChange = (index, value) => {
    const updated = [...formData.benefits];
    updated[index] = value;
    setFormData({ ...formData, benefits: updated });
  };

  const addBenefitField = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefitField = (index) => {
    const updated = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription) {
      addToast('Please fill in title and short description', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('icon', formData.icon);
      dataToSubmit.append('shortDescription', formData.shortDescription);
      dataToSubmit.append('detailedDescription', formData.detailedDescription);
      dataToSubmit.append(
        'benefits',
        JSON.stringify(formData.benefits.filter((b) => b.trim()))
      );
      dataToSubmit.append('status', formData.status);

      if (imageFile) {
        dataToSubmit.append('image', imageFile);
      } else if (formData.image) {
        dataToSubmit.append('image', formData.image);
      }

      if (selectedService) {
        await updateService(selectedService._id, dataToSubmit);
        addToast('Service updated successfully!', 'success');
      } else {
        await createService(dataToSubmit);
        addToast('New service created successfully!', 'success');
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Save service error:', err);
      addToast(err.response?.data?.message || 'Failed to save service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      setSubmitting(true);
      await deleteService(selectedService._id);
      addToast('Service deleted successfully!', 'success');
      setIsDeleteModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Delete service error:', err);
      addToast('Failed to delete service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.shortDescription?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Services Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Create, update, or remove digital services offered on the client website
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Add New Service
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
        <span className="text-xs font-medium text-slate-500">
          Total: <strong className="text-slate-800">{filteredServices.length}</strong>
        </span>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiLayers className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Services Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try creating a new service or adjusting search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Thumbnail */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {service.image ? (
                    <img
                      src={
                        service.image.startsWith('http')
                          ? service.image
                          : `http://localhost:5000${service.image}`
                      }
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                      <FiImage size={32} />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      service.status
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-400 text-white'
                    }`}
                  >
                    {service.status ? 'Active' : 'Draft'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-semibold">
                    {service.icon || 'FiTarget'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Benefits chips */}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.benefits.slice(0, 3).map((benefit, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]"
                        >
                          <FiCheck className="text-emerald-500" /> {benefit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(service)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(service)}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedService ? 'Edit Service' : 'Create New Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Meta Ads Management"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Icon Identifier
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g. FiTarget, FiGlobe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Status
              </label>
              <select
                value={formData.status ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value === 'true' })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="true">Active (Published)</option>
                <option value="false">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Short Description *
            </label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              rows="2"
              placeholder="Brief summary displayed on home/service cards..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Detailed Description
            </label>
            <textarea
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              rows="3"
              placeholder="Full details of what is included in this service..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Image Upload or URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Service Image (File Upload or URL)
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

          {/* Dynamic Key Benefits List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Key Benefits
            </label>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit #${index + 1}`}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefitField(index)}
                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors text-xs font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefitField}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1 block"
              >
                + Add Another Benefit
              </button>
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
              {submitting ? 'Saving...' : selectedService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Service"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete <strong>{selectedService?.title}</strong>? This action cannot be undone.
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
              {submitting ? 'Deleting...' : 'Delete Service'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesManager;
