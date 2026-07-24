import React, { useState, useEffect } from 'react';
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
} from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiCheck,
  FiStar,
} from 'react-icons/fi';

const PricingManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    period: '/month',
    description: '',
    features: [''],
    isPopular: false,
    buttonText: 'Get Started',
  });

  const { addToast } = useToast();

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
      const data = await getPricing();
      setPlans(data || []);
    } catch (err) {
      console.error('Fetch pricing error:', err);
      addToast('Failed to load pricing plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const openCreateModal = () => {
    setSelectedPlan(null);
    setFormData({
      title: '',
      price: '$499',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: ['Meta Ads Management', 'Weekly Reports', 'Dedicated Manager'],
      isPopular: false,
      buttonText: 'Get Started',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      title: plan.title || plan.name || '',
      price: plan.price || '',
      period: plan.period || '/month',
      description: plan.description || '',
      features: plan.features && plan.features.length > 0 ? plan.features : [''],
      isPopular: plan.isPopular || plan.popular || false,
      buttonText: plan.buttonText || 'Get Started',
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated.length ? updated : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      addToast('Please enter plan title and price', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        name: formData.title,
        price: formData.price,
        period: formData.period,
        description: formData.description,
        features: formData.features.filter((f) => f.trim()),
        isPopular: formData.isPopular,
        popular: formData.isPopular,
        buttonText: formData.buttonText,
      };

      if (selectedPlan) {
        await updatePricing(selectedPlan._id, payload);
        addToast('Pricing plan updated!', 'success');
      } else {
        await createPricing(payload);
        addToast('New pricing plan created!', 'success');
      }

      setIsModalOpen(false);
      fetchPricingPlans();
    } catch (err) {
      console.error('Save pricing error:', err);
      addToast(err.response?.data?.message || 'Failed to save pricing plan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;
    try {
      setSubmitting(true);
      await deletePricing(selectedPlan._id);
      addToast('Pricing plan deleted!', 'success');
      setIsDeleteModalOpen(false);
      fetchPricingPlans();
    } catch (err) {
      console.error('Delete pricing error:', err);
      addToast('Failed to delete pricing plan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pricing Plans
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure agency service packages, pricing, features, and popular highlights
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <FiPlus size={16} /> Add Pricing Plan
        </button>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiDollarSign className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Pricing Plans Found</h3>
          <p className="text-xs text-slate-400 mt-1">Create your first pricing package.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white rounded-2xl border ${
                plan.isPopular || plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                  : 'border-slate-100 shadow-sm'
              } p-6 transition-all flex flex-col justify-between relative overflow-hidden`}
            >
              {(plan.isPopular || plan.popular) && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <FiStar size={12} /> Popular Plan
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.title || plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>

                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">{plan.period || '/month'}</span>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Included Features:
                  </p>
                  {plan.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <FiCheck className="text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(plan)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <FiEdit /> Edit Plan
                </button>
                <button
                  onClick={() => openDeleteModal(plan)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Plan Title / Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Growth Marketing Package"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Price *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. $499 or NPR 35,000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Billing Cycle / Period
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. /month or /project"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Best for small to medium scale businesses..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Popular Flag
              </label>
              <select
                value={formData.isPopular ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.value === 'true' })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="false">Standard Plan</option>
                <option value="true">Featured / Popular Plan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Call To Action Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Get Started / Contact Us"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Features list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Features List
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature #${index + 1}`}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors text-xs font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1 block"
              >
                + Add Feature Point
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
              {submitting ? 'Saving...' : selectedPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Pricing Plan"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete <strong>{selectedPlan?.title || selectedPlan?.name}</strong>?
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
              {submitting ? 'Deleting...' : 'Delete Plan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingManager;
