import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, deleteLead } from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import {
  FiMail,
  FiSearch,
  FiTrash2,
  FiEye,
  FiUser,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
} from 'react-icons/fi';

const LeadsManager = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchLeadsData = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data || []);
    } catch (err) {
      console.error('Fetch leads error:', err);
      addToast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchLeadsData();
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Update status error:', err);
      addToast('Failed to update status', 'error');
    }
  };

  const openDetailModal = (lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    try {
      setSubmitting(true);
      await deleteLead(selectedLead._id);
      addToast('Inquiry lead deleted!', 'success');
      setIsDeleteModalOpen(false);
      setIsDetailModalOpen(false);
      fetchLeadsData();
    } catch (err) {
      console.error('Delete lead error:', err);
      addToast('Failed to delete inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const leadStatus = lead.status || 'New';
    const matchesStatus =
      statusFilter === 'All' || leadStatus === statusFilter;
    const matchesSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
      lead.message?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leads &amp; Contact Inquiries
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Review and process customer consultation requests and contact form submissions
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone, or message content..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <span className="text-xs font-medium text-slate-500">
            Total: <strong className="text-slate-800">{filteredLeads.length}</strong>
          </span>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
          <FiMail className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Inquiries Found</h3>
          <p className="text-xs text-slate-400 mt-1">Inquiries submitted from the client web app will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Contact Info</th>
                  <th className="py-3.5 px-6">Service Requested</th>
                  <th className="py-3.5 px-6">Submitted On</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{lead.name}</td>
                    <td className="py-4 px-6">
                      <div>{lead.email}</div>
                      <div className="text-slate-400 text-[11px]">{lead.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                        {lead.service || lead.subject || 'General Consultation'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none border border-slate-200 ${
                          lead.status === 'Contacted'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : lead.status === 'In Progress'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : lead.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openDetailModal(lead)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Inquiry Message"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(lead)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Inquiry"
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

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Inquiry Details"
      >
        {selectedLead && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block uppercase text-[10px]">Client Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedLead.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase text-[10px]">Requested Service</span>
                <span className="font-semibold text-blue-600">{selectedLead.service || selectedLead.subject || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase text-[10px]">Email Address</span>
                <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-medium block uppercase text-[10px]">Phone Number</span>
                <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                  {selectedLead.phone || 'N/A'}
                </a>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Inquiry Message:</span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-sans text-slate-800">
                {selectedLead.message || 'No detailed message provided.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Update Status:</span>
                <select
                  value={selectedLead.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openDeleteModal(selectedLead)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Inquiry"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete inquiry from <strong>{selectedLead?.name}</strong>?
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
              {submitting ? 'Deleting...' : 'Delete Inquiry'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadsManager;
