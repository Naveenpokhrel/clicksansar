import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders, lookupOrder, cancelOrderByNumber, deleteMyOrder } from '../../services/api';
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiLock,
  FiTrash2,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
  FiCopy,
  FiShield,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ClientDashboard = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const WHATSAPP_NUMBER = '9800000000';

  // Copy Product Key
  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Delete/Cancel Order explicitly from Client side
  const handleDeleteOrder = async (order) => {
    const targetId = order.orderNumber || order.backendId;
    const confirmDelete = window.confirm(
      `Are you sure you want to cancel and delete Order #${order.orderNumber}? This will remove it completely from your account and database.`
    );
    if (!confirmDelete) return;

    try {
      setDeletingOrderId(targetId);

      if (order.backendId && token) {
        await deleteMyOrder(order.backendId, token);
      } else if (order.orderNumber) {
        await cancelOrderByNumber(order.orderNumber);
      }

      const updated = orders.filter(
        (o) => o.orderNumber !== order.orderNumber && (!order.backendId || o.backendId !== order.backendId)
      );
      setOrders(updated);

      // Update localStorage
      try {
        const local = JSON.parse(localStorage.getItem('clicksansar_client_orders') || '[]');
        const updatedLocal = local.filter((o) => o.orderNumber !== order.orderNumber);
        localStorage.setItem('clicksansar_client_orders', JSON.stringify(updatedLocal));
      } catch (e) {}
    } catch (err) {
      console.log('Failed to delete order:', err);
      // Remove locally anyway if 404 or deleted
      const updated = orders.filter((o) => o.orderNumber !== order.orderNumber);
      setOrders(updated);
      try {
        const local = JSON.parse(localStorage.getItem('clicksansar_client_orders') || '[]');
        const updatedLocal = local.filter((o) => o.orderNumber !== order.orderNumber);
        localStorage.setItem('clicksansar_client_orders', JSON.stringify(updatedLocal));
      } catch (e) {}
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load orders from backend and local cache & sync with DB
  const fetchOrders = async () => {
    setLoading(true);
    let combined = [];

    // 1. Local cached orders
    try {
      const local = JSON.parse(localStorage.getItem('clicksansar_client_orders') || '[]');
      combined = [...local];
    } catch (e) {
      console.log('Local orders error:', e);
    }

    // 2. Backend authenticated user orders
    if (token) {
      try {
        const backendOrders = await getMyOrders(token);
        if (Array.isArray(backendOrders)) {
          backendOrders.forEach((bo) => {
            const isConfirmed = !!bo.isPaymentConfirmed;
            const orderNumMatch = bo.message?.match(/Order #?([0-9A-Za-z_-]+)/);
            const keyMatch = bo.message?.match(/Product Key:?\s*([0-9A-Za-z_-]+)/);
            const resolvedOrderNum =
              bo.orderNumber || (orderNumMatch ? orderNumMatch[1] : bo._id ? bo._id.slice(-6).toUpperCase() : '69557');

            const normalized = {
              orderNumber: resolvedOrderNum,
              productKey: bo.productKey || (keyMatch ? keyMatch[1] : `CS-${resolvedOrderNum}-ACTIVE`),
              orderDateTime: new Date(bo.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }),
              itemName: bo.serviceInterested || 'Digital Marketing Service',
              qty: 1,
              totalNPR: bo.amountPaid ? bo.amountPaid.replace(/[^0-9]/g, '') : '9450',
              paymentMethod: bo.paymentMethod || 'eSewa',
              paymentStatus: isConfirmed ? 'Verified' : 'Pending',
              isPaymentConfirmed: isConfirmed,
              deliveryStatus: bo.deliveryStatus || (isConfirmed ? 'In Progress' : 'Pending'),
              adminNote: bo.adminNote || '',
              txnId: bo.transactionId || 'N/A',
              backendId: bo._id,
            };

            const existingIdx = combined.findIndex((c) => c.orderNumber === normalized.orderNumber);
            if (existingIdx !== -1) {
              combined[existingIdx] = { ...combined[existingIdx], ...normalized };
            } else {
              combined.push(normalized);
            }
          });
        }
      } catch (err) {
        console.log('Backend orders fetch failed, using local orders');
      }
    }

    // 3. Purge orders deleted from backend database
    for (let i = 0; i < combined.length; i++) {
      if (combined[i].orderNumber) {
        try {
          const lookedUp = await lookupOrder(combined[i].orderNumber);
          if (lookedUp) {
            combined[i].isPaymentConfirmed = !!lookedUp.isPaymentConfirmed;
            combined[i].paymentStatus = lookedUp.isPaymentConfirmed ? 'Verified' : 'Pending';
            combined[i].productKey = lookedUp.productKey;
            combined[i].deliveryStatus = lookedUp.deliveryStatus || 'Pending';
            combined[i].adminNote = lookedUp.adminNote || '';
          }
        } catch (e) {
          // 404 Not Found -> Admin deleted this order from database! Remove from everywhere.
          if (e.message && (e.message.toLowerCase().includes('not found') || e.message.includes('404'))) {
            combined.splice(i, 1);
            i--;
          }
        }
      }
    }

    // Save cleaned/synced version back to localStorage
    try {
      localStorage.setItem('clicksansar_client_orders', JSON.stringify(combined));
    } catch (e) {}

    setOrders(combined);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, token]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 text-left font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1a66ff] to-blue-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome, {user?.name || 'Client'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a66ff] text-xs font-bold border border-blue-100 uppercase tracking-wider">
                  Client Portal
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <FiMail className="text-slate-400" /> {user?.email || 'N/A'}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1">
                    <FiPhone className="text-slate-400" /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              <span>Sync Orders</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100"
            >
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Client Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#1a66ff] flex items-center justify-center font-bold">
                <FiShoppingBag />
              </span>
              <h2 className="text-lg font-black text-slate-900">Your Active Campaigns & Orders</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              Total: {orders.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1a66ff] border-t-transparent mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Syncing live order status with database...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-[#1a66ff] rounded-2xl flex items-center justify-center mx-auto text-2xl">
                <FiShoppingBag />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Active Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you purchase a Meta Ads package or digital marketing service via QR checkout, your orders will appear here automatically.
                </p>
              </div>
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-2.5 bg-[#1a66ff] hover:bg-[#1554d1] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                Explore Services & Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={order.orderNumber || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-base">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          ({order.orderDateTime})
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1a66ff] text-sm mt-0.5">
                        {order.itemName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                        NPR {Number(order.totalNPR).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Payment Method</span>
                      <span className="font-bold text-slate-800">{order.paymentMethod || 'eSewa QR'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Payment Verification</span>
                      <div>
                        {order.isPaymentConfirmed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 shadow-sm">
                            <FiCheckCircle className="text-emerald-600" /> Verified by Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 shadow-sm">
                            <FiClock className="text-amber-600 animate-pulse" /> Pending Verification
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Delivery / Campaign Status</span>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                            order.deliveryStatus === 'Completed' || order.deliveryStatus === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.isPaymentConfirmed
                              ? 'bg-blue-100 text-[#1a66ff]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.deliveryStatus || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {order.adminNote && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
                      <FiCheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0 text-base" />
                      <div>
                        <span className="font-black text-emerald-950">Admin Note from Naveen Pokhrel: </span>
                        <span>{order.adminNote}</span>
                      </div>
                    </div>
                  )}

                  {/* Product Key */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    {order.isPaymentConfirmed ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-semibold">Product Key:</span>
                        <span className="font-mono font-black text-emerald-800 bg-emerald-50 border border-emerald-300 text-sm sm:text-base tracking-wider px-3.5 py-1.5 rounded-lg select-all shadow-inner">
                          {order.productKey}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(order.productKey)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1a66ff] hover:bg-[#1554d1] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <FiCopy size={12} />
                          <span>{copiedKey === order.productKey ? 'Copied!' : 'Copy Key'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-semibold">Product Key:</span>
                        <span className="font-mono font-bold text-amber-800 bg-amber-50/90 border border-amber-200 text-xs tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <FiLock className="text-amber-600" />
                          <span>Unlocks After Admin Confirmation</span>
                        </span>
                      </div>
                    )}

                    {order.txnId && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium">Txn ID:</span>
                        <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {order.txnId}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={`https://wa.me/977${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hi Naveen! Checking status for Order #${order.orderNumber} for ${order.itemName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                    >
                      <FaWhatsapp size={15} />
                      <span>WhatsApp Campaign Manager</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(order)}
                      disabled={deletingOrderId === (order.orderNumber || order.backendId)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <FiTrash2 size={13} className={deletingOrderId === (order.orderNumber || order.backendId) ? 'animate-spin' : ''} />
                      <span>{deletingOrderId === (order.orderNumber || order.backendId) ? 'Deleting...' : 'Delete Order'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
