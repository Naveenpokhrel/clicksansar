import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus, confirmPaymentAndReleaseKey, deleteLead } from '../services/api';
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
  FiCreditCard,
  FiCheckCircle,
  FiImage,
  FiCopy,
  FiKey,
  FiShield,
  FiCheck,
  FiClock,
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

  // Key confirmation state for detail modal
  const [editableProductKey, setEditableProductKey] = useState('');
  const [editableDeliveryStatus, setEditableDeliveryStatus] = useState('In Progress');
  const [adminNote, setAdminNote] = useState('');

  const { addToast } = useToast();

  const fetchLeadsData = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data?.leads || data || []);
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

  const openDetailModal = (lead) => {
    setSelectedLead(lead);
    setEditableProductKey(lead.productKey || `CS-${lead.orderNumber || lead._id.slice(-5).toUpperCase()}-ACTIVE`);
    setEditableDeliveryStatus(lead.deliveryStatus || (lead.isPaymentConfirmed ? 'In Progress' : 'Pending'));
    setAdminNote(lead.adminNote || '');
    setIsDetailModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  // Quick confirm payment & release key directly
  const handleConfirmPayment = async (leadToConfirm) => {
    const target = leadToConfirm || selectedLead;
    if (!target) return;

    try {
      setSubmitting(true);
      const res = await confirmPaymentAndReleaseKey(target._id, {
        productKey: editableProductKey || target.productKey,
        deliveryStatus: editableDeliveryStatus || 'In Progress',
        adminNote: adminNote || 'Payment confirmed by Naveen Pokhrel. Your campaign is active!',
      });

      addToast('Payment Confirmed! Product Key is now visible to client.', 'success');
      fetchLeadsData();
      if (selectedLead && selectedLead._id === target._id) {
        setSelectedLead(res.lead || { ...selectedLead, isPaymentConfirmed: true, status: 'Payment Received' });
      }
    } catch (err) {
      console.error('Confirm error:', err);
      addToast(err.response?.data?.message || 'Failed to confirm payment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleDelete = async () => {
    if (!selectedLead) return;
    try {
      setSubmitting(true);
      await deleteLead(selectedLead._id);
      addToast('Inquiry deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      fetchLeadsData();
    } catch (err) {
      console.error('Delete lead error:', err);
      addToast('Failed to delete inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const nameStr = lead.fullName || lead.name || '';
    const emailStr = lead.email || '';
    const phoneStr = lead.phone || '';
    const serviceStr = lead.serviceInterested || lead.service || '';
    const txnStr = lead.transactionId || '';
    const orderStr = lead.orderNumber || '';
    const keyStr = lead.productKey || '';

    const matchesSearch =
      nameStr.toLowerCase().includes(search.toLowerCase()) ||
      emailStr.toLowerCase().includes(search.toLowerCase()) ||
      phoneStr.toLowerCase().includes(search.toLowerCase()) ||
      serviceStr.toLowerCase().includes(search.toLowerCase()) ||
      txnStr.toLowerCase().includes(search.toLowerCase()) ||
      orderStr.toLowerCase().includes(search.toLowerCase()) ||
      keyStr.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Confirmed' && lead.isPaymentConfirmed) ||
      (statusFilter === 'Pending' && !lead.isPaymentConfirmed && (lead.paymentMethod || lead.transactionId)) ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Orders, Inquiries & Payment Confirmation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming eSewa receipts, confirm customer payments, and unlock Product Keys for clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            Total: {filteredLeads.length}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, transaction ID, order #, or product key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Inquiries & Orders</option>
            <option value="Pending">⏳ Awaiting Payment Verification</option>
            <option value="Confirmed">✅ Payment Confirmed / Key Released</option>
            <option value="New">Status: New</option>
            <option value="Payment Received">Status: Payment Received</option>
            <option value="In Progress">Status: In Progress</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-xs font-semibold text-slate-500 mt-3">Loading orders & inquiries...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm text-slate-400 space-y-2">
          <FiMail className="mx-auto text-4xl text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No Orders Found</p>
          <p className="text-xs">When clients complete eSewa checkout or submit inquiry forms, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Order & Client</th>
                  <th className="py-3.5 px-6">Service & Amount</th>
                  <th className="py-3.5 px-6">eSewa Proof</th>
                  <th className="py-3.5 px-6">Product Key Status</th>
                  <th className="py-3.5 px-6">Order Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredLeads.map((lead) => {
                  const hasPayment = lead.paymentMethod || lead.transactionId;
                  const clientName = lead.fullName || lead.name || 'Client';

                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Client Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{clientName}</span>
                          {lead.orderNumber && (
                            <span className="text-[10px] font-bold font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              #{lead.orderNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono">{lead.email}</div>
                        <div className="text-blue-600 text-[11px] font-semibold">{lead.phone || 'No phone'}</div>
                      </td>

                      {/* Service & Amount */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-[11px] border border-blue-100 inline-block mb-1">
                          {lead.serviceInterested || lead.service || 'Meta Ads Campaign'}
                        </span>
                        {lead.amountPaid && (
                          <div className="text-emerald-700 font-black text-xs">
                            {lead.amountPaid}
                          </div>
                        )}
                      </td>

                      {/* Payment Proof */}
                      <td className="py-4 px-6">
                        {hasPayment ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#60bb46]" />
                              {lead.paymentMethod || 'eSewa'}
                            </span>
                            {lead.transactionId && (
                              <div className="text-[11px] font-mono text-slate-900 font-bold">
                                TXN: {lead.transactionId}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">General Inquiry</span>
                        )}
                      </td>

                      {/* Product Key Status (Connected to Client) */}
                      <td className="py-4 px-6">
                        {lead.isPaymentConfirmed ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <FiCheck size={11} /> Key Visible to Client
                            </span>
                            <div className="font-mono text-[11px] font-bold text-slate-800 select-all">
                              {lead.productKey || 'ACTIVE'}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <FiClock size={11} /> Locked (Awaiting Verification)
                            </span>
                            <button
                              type="button"
                              onClick={() => openDetailModal(lead)}
                              className="text-[11px] text-[#1a66ff] hover:underline font-bold block"
                            >
                              Verify & Release Key
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none border ${
                            lead.status === 'Payment Received'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : lead.status === 'In Progress'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : lead.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Payment Received">Payment Received</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openDetailModal(lead)}
                          className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-bold text-xs inline-flex items-center gap-1"
                        >
                          <FiEye size={13} />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(lead)}
                          className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry & Order Detail & Key Confirmation Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Review eSewa Payment & Release Product Key"
        maxWidth="max-w-2xl"
      >
        {selectedLead && (
          <div className="space-y-5 text-xs text-slate-700 text-left">
            
            {/* Top Alert Banner based on Key Visibility */}
            {selectedLead.isPaymentConfirmed ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800">
                <span className="flex items-center gap-2 font-bold text-xs">
                  <FiCheckCircle className="text-emerald-600 text-base" />
                  <span>Payment Verified: Product Key is UNLOCKED & visible on Client's Portal!</span>
                </span>
                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-black uppercase">
                  Active
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-800">
                <span className="flex items-center gap-2 font-bold text-xs">
                  <FiClock className="text-amber-600 text-base" />
                  <span>Product Key is LOCKED. Click "Confirm & Release Key" below once eSewa payment is verified.</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded font-black uppercase">
                  Pending
                </span>
              </div>
            )}

            {/* Client & Service Information */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Client Name</span>
                <span className="font-extrabold text-slate-900 text-sm block">
                  {selectedLead.fullName || selectedLead.name || 'Client'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Requested Service</span>
                <span className="font-bold text-blue-600 text-sm block">
                  {selectedLead.serviceInterested || selectedLead.service || 'Meta Ads Campaign'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Email Address</span>
                <a href={`mailto:${selectedLead.email}`} className="text-blue-600 font-semibold hover:underline block">
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">WhatsApp / Mobile</span>
                <a
                  href={`https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline block"
                >
                  {selectedLead.phone || 'N/A'} (Chat on WhatsApp)
                </a>
              </div>
            </div>

            {/* Payment Details Box with Proof Screenshot */}
            {(selectedLead.paymentMethod || selectedLead.transactionId || selectedLead.paymentProof) && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5">
                    <FiCreditCard className="text-emerald-600" />
                    <span>eSewa Transfer Details</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full font-bold text-[10px]">
                    {selectedLead.paymentMethod || 'eSewa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Transaction / Ref ID:</span>
                    <span className="font-mono font-black text-slate-900 text-sm bg-white px-2 py-1 rounded border border-emerald-200 inline-block">
                      {selectedLead.transactionId || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Amount Paid:</span>
                    <span className="font-black text-emerald-700 text-base">
                      {selectedLead.amountPaid || selectedLead.budget || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Screenshot Proof */}
                {selectedLead.paymentProof && (
                  <div className="pt-2 border-t border-emerald-200">
                    <span className="text-emerald-800 font-bold block text-[10px] mb-2 flex items-center gap-1">
                      <FiImage /> Receipt Screenshot from Client:
                    </span>
                    <a
                      href={selectedLead.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block group relative"
                    >
                      <img
                        src={selectedLead.paymentProof}
                        alt="Payment Receipt Proof"
                        className="w-full max-h-60 object-contain rounded-xl border border-emerald-300 shadow-md group-hover:opacity-90 transition-opacity bg-white"
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                        Click to enlarge 🔍
                      </span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Product Key & Delivery Setup (Admin to Client Connection) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <FiKey className="text-[#1a66ff]" />
                  <span>Product License Key & Client Delivery Status</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Visible to client once confirmed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Product Key
                  </label>
                  <input
                    type="text"
                    value={editableProductKey}
                    onChange={(e) => setEditableProductKey(e.target.value)}
                    placeholder="e.g. CS-69557-2024-8F2A"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Delivery Status
                  </label>
                  <select
                    value={editableDeliveryStatus}
                    onChange={(e) => setEditableDeliveryStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress (Setup ongoing)</option>
                    <option value="Active">Active (Campaign running)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Admin Note to Client (Visible on their wallet)
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. eSewa payment verified! Your Meta Ads campaign is active."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleConfirmPayment()}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <FiShield size={14} />
                <span>
                  {selectedLead.isPaymentConfirmed
                    ? 'Update Key & Delivery Status'
                    : 'Confirm Payment & Release Key to Client'}
                </span>
              </button>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => openDeleteModal(selectedLead)}
                  className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Order"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete order from <strong>{selectedLead?.fullName || selectedLead?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Order'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadsManager;
