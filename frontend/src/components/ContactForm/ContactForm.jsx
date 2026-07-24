import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitLead } from '../../services/api';

// Validation Schema
const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  companyName: z.string().optional(),
  businessType: z.string().optional(),
  serviceInterested: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().optional(),
});

const ContactForm = ({ preselectedService = '' }) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceInterested: preselectedService || '',
      companyName: '',
      businessType: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await submitLead(data);
      if (response.success) {
        setSuccess(response.message);
        reset();
      } else {
        setError(response.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const servicesList = [
    'Meta Ads (Facebook & Instagram)',
    'Social Media Management',
    'Content Creation',
    'Website Development',
    'SEO Optimization',
    'TikTok Marketing',
    'YouTube Marketing',
    'Cinematic Video Shoots',
    'Graphic Design & Branding',
    'Digital Product Promotion',
    'Starter Package',
    'Professional Package',
    'Premium Growth Package',
    'Other Service',
  ];

  return (
    <div className="bg-slate-50 border border-slate-100 p-6 sm:p-10 rounded-3xl shadow-md">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Book a Free Strategy Consultation</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Fill out the form below. Our digital marketing consultants will review your site and contact you within 24 hours.
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              {...register('fullName')}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:border-blue-500 ${
                errors.fullName ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="e.g. Rajesh Hamal"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 font-semibold">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:border-blue-500 ${
                errors.email ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
            <input
              type="text"
              {...register('phone')}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:border-blue-500 ${
                errors.phone ? 'border-red-400' : 'border-slate-200'
              }`}
              placeholder="e.g. +977 9851000000"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Service Interested In */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Service Interested In *</label>
            <select
              {...register('serviceInterested')}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm focus:outline-none focus:border-blue-500 ${
                errors.serviceInterested ? 'border-red-400' : 'border-slate-200'
              }`}
            >
              <option value="">Select a service...</option>
              {servicesList.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.serviceInterested && (
              <p className="text-xs text-red-500 font-semibold">{errors.serviceInterested.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              {...register('companyName')}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Sansar Ventures"
            />
          </div>

          {/* Business Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Type</label>
            <input
              type="text"
              {...register('businessType')}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. E-Commerce, Education"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Monthly Budget (Rs.)</label>
          <select
            {...register('budget')}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Choose a budget tier...</option>
            <option value="Under Rs. 20,000">Under Rs. 20,000</option>
            <option value="Rs. 20,000 - Rs. 50,000">Rs. 20,000 - Rs. 50,000</option>
            <option value="Rs. 50,000 - Rs. 100,000">Rs. 50,000 - Rs. 100,000</option>
            <option value="Above Rs. 100,000">Above Rs. 100,000</option>
          </select>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message Details</label>
          <textarea
            {...register('message')}
            rows="4"
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Tell us about your digital marketing goals or special requirements..."
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 blue-gradient shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 disabled:opacity-50"
        >
          {submitting ? 'Submitting Inquiry...' : 'Submit Consultation Request'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
