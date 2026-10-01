import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLeads,
  getServices,
  updateLeadStatus,
} from '../services/api';
import { useToast } from '../components/Toast';
import {
  FiMail,
  FiLayers,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiCreditCard,
  FiShield,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    leads: [],
    servicesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leads, services] = await Promise.all([
        getLeads().catch(() => []),
        getServices().catch(() => []),
      ]);

      const leadsArray = Array.isArray(leads) ? leads : (leads?.leads || []);
      const servicesArray = Array.isArray(services) ? services : (services?.services || []);
      setStats({
        leads: leadsArray,
        servicesCount: servicesArray.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const newLeadsCount = stats.leads.filter(
    (l) => l.status === 'New' || !l.status
  ).length;

  const paymentReceivedCount = stats.leads.filter(
    (l) => l.status === 'Payment Received' || l.paymentMethod === 'eSewa'
  ).length;

  const inProgressCount = stats.leads.filter(
    (l) => l.status === 'In Progress'
  ).length;

  // Lead Status Breakdown
  const leadStatusCounts = [
    {
      name: 'New Orders',
      value: stats.leads.filter((l) => l.status === 'New' || !l.status).length,
      color: '#3b82f6',
    },
    {
      name: 'Payment Verified',
      value: stats.leads.filter((l) => l.status === 'Payment Received').length,
      color: '#10b981',
    },
    {
      name: 'In Progress',
      value: stats.leads.filter((l) => l.status === 'In Progress').length,
      color: '#8b5cf6',
    },
    {
      name: 'Contacted',
      value: stats.leads.filter((l) => l.status === 'Contacted').length,
      color: '#eab308',
    },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Click Sansar Control Panel
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Monitor client orders, eSewa payment verifications, campaign statuses, and active marketing services.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inquiries & Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Orders & Leads
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stats.leads.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <FiMail size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              {newLeadsCount} New Pending
            </span>
            <Link to="/leads" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 font-medium">
              View All <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Services
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stats.servicesCount}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <FiLayers size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Outlets & Boosts</span>
            <Link to="/services" className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-medium">
              Manage <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* eSewa Payments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                eSewa Orders / Proofs
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {paymentReceivedCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <FiCreditCard size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Direct eSewa Pay
            </span>
            <Link to="/leads" className="text-slate-400 hover:text-emerald-600 flex items-center gap-1 font-medium">
              Verify <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* In-Progress Campaigns */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Campaigns
              </p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">
                {inProgressCount}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <FiTrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Running Setups</span>
            <Link to="/leads" className="text-slate-400 hover:text-purple-600 flex items-center gap-1 font-medium">
              Monitor <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Breakdown & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Order & Lead Status</h3>
                <p className="text-xs text-slate-500">Pipeline progression</p>
              </div>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                <FiClock size={18} />
              </div>
            </div>

            {leadStatusCounts.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatusCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leadStatusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
                No orders recorded yet
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            {leadStatusCounts.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Instructions & eSewa Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Direct Order Processing</h3>
              <p className="text-xs text-slate-500">Verification guideline for Naveen Pokhrel (9767620241)</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <FiShield className="text-emerald-600" />
              eSewa Merchant Active
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <strong className="text-slate-800 font-bold block mb-0.5">Check Incoming eSewa Alerts:</strong>
                When clients scan your QR, they submit their Transaction ID and screenshot receipt.
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <strong className="text-slate-800 font-bold block mb-0.5">Verify & Update Status in Leads:</strong>
                Open <Link to="/leads" className="text-blue-600 underline font-bold">Leads & Inquiries</Link>, review the payment proof screenshot, and change status to <em>Payment Received</em> or <em>In Progress</em>.
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <strong className="text-slate-800 font-bold block mb-0.5">Activate Client Campaign:</strong>
                Set up the Meta ads or media service. Clients can track the live progress via their Product Key on the client portal.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Customer Inquiries & Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Customer Inquiries & Orders</h3>
            <p className="text-xs text-slate-500">Latest submissions from website and checkout modal</p>
          </div>
          <Link
            to="/leads"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors w-fit"
          >
            Manage All Orders & Leads <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Client Name</th>
                <th className="py-3.5 px-6">Email / WhatsApp</th>
                <th className="py-3.5 px-6">Service Requested</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Amount / Txn</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {stats.leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No leads or orders submitted yet.
                  </td>
                </tr>
              ) : (
                stats.leads.slice(0, 6).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {lead.fullName || lead.name || 'Client'}
                    </td>
                    <td className="py-4 px-6">
                      <div>{lead.email}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{lead.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-[11px] font-semibold">
                        {lead.serviceInterested || lead.service || lead.subject || 'Campaign Service'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {lead.paymentMethod ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60bb46]" />
                          {lead.paymentMethod}
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Inquiry</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{lead.amountPaid || lead.budget || 'N/A'}</div>
                      {lead.transactionId && (
                        <div className="text-[10px] font-mono text-[#1a66ff]">{lead.transactionId}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'Payment Received'
                            ? 'bg-emerald-100 text-emerald-700'
                            : lead.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-700'
                            : lead.status === 'Contacted'
                            ? 'bg-amber-100 text-amber-700'
                            : lead.status === 'Converted'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-blue-600"
                      >
                        <option value="New">New</option>
                        <option value="Payment Received">Payment Received</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
