import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getLeads,
  getServices,
  getBlogs,
  getPortfolios,
  getGallery,
  getTeam,
  getTestimonials,
  updateLeadStatus,
} from '../services/api';
import { useToast } from '../components/Toast';
import {
  FiMail,
  FiLayers,
  FiFileText,
  FiBriefcase,
  FiImage,
  FiUsers,
  FiMessageSquare,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    leads: [],
    servicesCount: 0,
    blogsCount: 0,
    portfoliosCount: 0,
    galleryCount: 0,
    teamCount: 0,
    testimonialsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leads, services, blogs, portfolios, gallery, team, testimonials] =
        await Promise.all([
          getLeads().catch(() => []),
          getServices().catch(() => []),
          getBlogs().catch(() => []),
          getPortfolios().catch(() => []),
          getGallery().catch(() => []),
          getTeam().catch(() => []),
          getTestimonials().catch(() => []),
        ]);

      setStats({
        leads: Array.isArray(leads) ? leads : [],
        servicesCount: services.length || 0,
        blogsCount: blogs.length || 0,
        portfoliosCount: portfolios.length || 0,
        galleryCount: gallery.length || 0,
        teamCount: team.length || 0,
        testimonialsCount: testimonials.length || 0,
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
      addToast(`Lead status updated to ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to update lead status', 'error');
    }
  };

  const newLeadsCount = stats.leads.filter(
    (l) => l.status === 'New' || !l.status
  ).length;

  // Chart Data
  const contentDistribution = [
    { name: 'Services', count: stats.servicesCount },
    { name: 'Blogs', count: stats.blogsCount },
    { name: 'Portfolio', count: stats.portfoliosCount },
    { name: 'Gallery', count: stats.galleryCount },
    { name: 'Team', count: stats.teamCount },
    { name: 'Reviews', count: stats.testimonialsCount },
  ];

  const leadStatusCounts = [
    {
      name: 'New',
      value: stats.leads.filter((l) => l.status === 'New' || !l.status).length,
      color: '#3b82f6',
    },
    {
      name: 'Contacted',
      value: stats.leads.filter((l) => l.status === 'Contacted').length,
      color: '#eab308',
    },
    {
      name: 'In Progress',
      value: stats.leads.filter((l) => l.status === 'In Progress').length,
      color: '#8b5cf6',
    },
    {
      name: 'Closed',
      value: stats.leads.filter((l) => l.status === 'Closed').length,
      color: '#10b981',
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Overview Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome to Click Sansar CMS
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Manage client inquiry leads, edit site services, update blog posts, maintain portfolios, and customize website content in real-time.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Leads / Inquiries
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
            <span className="text-slate-500 font-medium">Offered Services</span>
            <Link to="/services" className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-medium">
              Manage <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Blog Posts
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stats.blogsCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <FiFileText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Published Articles</span>
            <Link to="/blogs" className="text-slate-400 hover:text-emerald-600 flex items-center gap-1 font-medium">
              Manage <FiArrowRight />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Portfolio Projects
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stats.portfoliosCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <FiBriefcase size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Showcased Works</span>
            <Link to="/portfolio" className="text-slate-400 hover:text-amber-600 flex items-center gap-1 font-medium">
              Manage <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Content Statistics</h3>
              <p className="text-xs text-slate-500">Distribution of live website modules</p>
            </div>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
              <FiTrendingUp size={18} />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentDistribution}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Leads Status</h3>
                <p className="text-xs text-slate-500">Inquiry conversion pipeline</p>
              </div>
              <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                <FiMail size={18} />
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
                No inquiries recorded yet
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
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Customer Inquiries</h3>
            <p className="text-xs text-slate-500">Latest form submissions from client website</p>
          </div>
          <Link
            to="/leads"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors w-fit"
          >
            Manage All Inquiries <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email / Phone</th>
                <th className="py-3.5 px-6">Service Requested</th>
                <th className="py-3.5 px-6">Submitted Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {stats.leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No leads or inquiries submitted yet.
                  </td>
                </tr>
              ) : (
                stats.leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{lead.name}</td>
                    <td className="py-4 px-6">
                      <div>{lead.email}</div>
                      <div className="text-slate-400 text-[11px]">{lead.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                        {lead.service || lead.subject || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === 'Contacted'
                            ? 'bg-amber-100 text-amber-700'
                            : lead.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-700'
                            : lead.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-600"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
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
