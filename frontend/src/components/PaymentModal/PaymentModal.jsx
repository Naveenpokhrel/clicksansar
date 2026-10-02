import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiLock,
  FiCheck,
  FiCopy,
  FiUploadCloud,
  FiShield,
  FiSmartphone,
  FiAlertCircle,
  FiUser,
  FiTag,
  FiClock,
  FiShoppingBag,
  FiArrowRight,
  FiGrid,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { uploadImage, submitLead } from '../../services/api';
import ClickSansarLogo from '../Navbar/ClickSansarLogo';

const PaymentModal = ({ isOpen, onClose, orderData }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Product price information
  const itemName = orderData?.title || 'Digital Subscription';
  const subtotalNPR = Math.round(orderData?.totalNPR || orderData?.totalCost || 500);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [esewaNumber, setEsewaNumber] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Screenshot Upload State
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);

  // Copy Feedback State
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState('');

  // eSewa QR Configuration
  const esewaConfig = {
    name: 'eSewa',
    accountName: 'Chandani Kumari Shah',
    walletId: '9703440607',
    qrImage: '/esewa-qr.svg',
  };

  // Pre-fill user details when modal opens and user is authenticated
  useEffect(() => {
    if (isOpen && user) {
      if (user.fullName && !fullName) setFullName(user.fullName);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [isOpen, user]);

  const finalTotalNPR = Math.max(0, Math.round(subtotalNPR * (1 - discountPercent / 100)));

  // Coupon handler
  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'CLICK10' || coupon.trim().toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid Coupon Code. Try "CLICK10" for 10% off.');
    }
  };

  // Copy Handlers
  const handleCopyWallet = () => {
    navigator.clipboard.writeText(esewaConfig.walletId);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(`NPR ${finalTotalNPR.toLocaleString()}`);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Reset and close handler
  const handleClose = () => {
    setSubmittedSuccess(false);
    setProofFile(null);
    setProofPreview('');
    setPaymentRef('');
    setEsewaNumber('');
    setCoupon('');
    setDiscountPercent(0);
    setCouponApplied(false);
    setErrorMessage('');
    setSubmittedOrderNumber('');
    onClose();
  };

  // Handler to continue shopping & explore more services
  const handleBuyMore = () => {
    handleClose();
    navigate('/services/subscriptions');
  };

  // Handler to go directly to Client Dashboard
  const handleGoDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };

  // Proof Upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));

    try {
      setUploadingProof(true);
      const res = await uploadImage(file);
      if (res?.imageUrl) {
        setProofPreview(res.imageUrl);
      }
    } catch (err) {
      console.log('Local preview used for proof screenshot', err);
    } finally {
      setUploadingProof(false);
    }
  };

  // Submit Payment handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !phone) {
      setErrorMessage('Please fill in your Full Name, Email, and Phone Number.');
      return;
    }

    if (!esewaNumber) {
      setErrorMessage('Please enter the eSewa Number you paid from.');
      return;
    }

    if (!paymentRef) {
      setErrorMessage('Please enter your payment Reference / Remarks.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName,
        email,
        phone,
        serviceInterested: itemName,
        budget: `NPR ${finalTotalNPR.toLocaleString()}`,
        message: `Subscription Order: ${itemName}. eSewa Paid From: ${esewaNumber}. Ref: ${paymentRef}`,
        paymentMethod: 'eSewa',
        transactionId: paymentRef,
        amountPaid: `NPR ${finalTotalNPR.toLocaleString()}`,
        paymentProof: proofPreview || '',
      };

      const result = await submitLead(payload);
      const generatedOrderNo = result?.orderNumber || result?.lead?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`;
      setSubmittedOrderNumber(generatedOrderNo);

      // Save to client localStorage so it appears on Dashboard immediately
      try {
        const local = JSON.parse(localStorage.getItem('clicksansar_client_orders') || '[]');
        const newOrder = {
          orderNumber: generatedOrderNo,
          serviceInterested: itemName,
          budget: `NPR ${finalTotalNPR.toLocaleString()}`,
          amountPaid: `NPR ${finalTotalNPR.toLocaleString()}`,
          isPaymentConfirmed: false,
          paymentStatus: 'Pending',
          status: 'New',
          productKey: 'LOCKED_AWAITING_CONFIRMATION',
          createdAt: new Date().toISOString(),
          backendId: result?._id || result?.lead?._id,
        };
        localStorage.setItem('clicksansar_client_orders', JSON.stringify([newOrder, ...local]));
      } catch (storageErr) {
        console.log('Error caching client order:', storageErr);
      }

      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Safe early exit AFTER all hooks are called
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-all">
      <div className="relative w-full max-w-5xl bg-white text-slate-800 rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <ClickSansarLogo size="small" />
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                eSewa QR Checkout
              </h3>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Scan eSewa QR, pay the exact price & upload your screenshot for admin verification
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-grow space-y-6">
          {submittedSuccess ? (
            <div className="py-8 px-4 sm:px-6 text-center space-y-6 max-w-lg mx-auto animate-fadeIn">
              
              {/* Status Icon */}
              <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <FiClock size={40} className="animate-pulse" />
              </div>

              {/* Status Header */}
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                  Order #{submittedOrderNumber || 'RECEIVED'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  PENDING VERIFICATION
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Your payment has been received successfully! Our admin team is verifying your payment details. Once verified, your product key/license will be unlocked.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/90 text-left text-xs space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center text-slate-700 pb-2 border-b border-amber-200/60">
                  <span className="font-semibold text-slate-500">Purchased Item:</span>
                  <span className="text-slate-900 font-bold">{itemName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pb-2 border-b border-amber-200/60">
                  <span className="font-semibold text-slate-500">Total Paid:</span>
                  <span className="text-emerald-700 font-black text-sm">
                    NPR {finalTotalNPR.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pb-2 border-b border-amber-200/60">
                  <span className="font-semibold text-slate-500">eSewa Paid From:</span>
                  <span className="text-[#1a66ff] font-bold">{esewaNumber}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold text-slate-500">Payment Ref / Remarks:</span>
                  <span className="text-slate-900 font-mono font-bold">{paymentRef}</span>
                </div>
              </div>

              {/* Lock Notice */}
              <div className="p-3.5 bg-blue-50/90 border border-blue-100 rounded-xl text-xs text-[#1a66ff] font-semibold text-left flex items-start gap-2">
                <FiLock className="flex-shrink-0 mt-0.5" />
                <span>
                  Your product key / credentials remain securely locked until admin approves the payment in the Admin Dashboard.
                </span>
              </div>

              {/* Action Buttons: 1. Buy More Services, 2. View in Dashboard */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleBuyMore}
                  className="w-full py-3.5 bg-[#1a66ff] hover:bg-[#1554d1] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 hover:scale-[1.01]"
                >
                  <FiShoppingBag size={16} />
                  <span>Buy More Services & Subscriptions</span>
                  <FiArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleGoDashboard}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FiGrid size={15} />
                  <span>Track Order in Client Dashboard</span>
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Customer Details & eSewa Payment */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* 1. Customer Details */}
                <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FiUser className="text-[#1a66ff]" />
                      <span>Customer Details</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">Encrypted & Confidential</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a66ff] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@email.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a66ff] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a66ff] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method: eSewa QR */}
                <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FiSmartphone className="text-[#1a66ff]" />
                      <span>Pay with eSewa</span>
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Official eSewa QR
                    </span>
                  </div>

                  {/* eSewa Card & Details */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                      
                      {/* eSewa QR Image */}
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex-shrink-0 flex flex-col items-center">
                        <img
                          src={esewaConfig.qrImage}
                          alt="eSewa QR Code"
                          className="w-36 h-36 object-contain rounded-lg"
                        />
                        <span className="text-[10px] font-bold text-slate-600 mt-2">
                          Scan with eSewa
                        </span>
                      </div>

                      {/* Receiver Details */}
                      <div className="space-y-3 flex-grow w-full">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            RECEIVER NAME:
                          </span>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {esewaConfig.accountName}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            eSEWA ID / MOBILE NO:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-slate-100 text-slate-900 px-3 py-1 rounded-lg text-xs border border-slate-200">
                              {esewaConfig.walletId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyWallet}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1a66ff] border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                            >
                              <FiCopy size={12} />
                              <span>{copiedWallet ? 'Copied!' : 'Copy ID'}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            AMOUNT TO PAY:
                          </span>
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                            <span className="text-lg font-black text-emerald-700">
                              NPR {finalTotalNPR.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyAmount}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
                            >
                              <FiCopy size={11} />
                              <span>{copiedAmount ? 'Copied!' : 'Copy Amount'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600">
                      <p className="font-bold text-slate-800 mb-1">Payment Instruction:</p>
                      <p className="leading-relaxed text-slate-600">
                        Scan the QR code using eSewa and complete the payment of <strong>NPR {finalTotalNPR.toLocaleString()}</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Customer eSewa Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      eSewa Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={esewaNumber}
                      onChange={(e) => setEsewaNumber(e.target.value)}
                      placeholder="Number you paid from"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-[#1a66ff] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Payment Reference / Remarks */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Payment Reference / Remarks <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Enter your payment reference"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#1a66ff] focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Upload Payment Screenshot */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Upload Payment Screenshot <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative border-2 border-dashed border-slate-200 hover:border-[#1a66ff] bg-white rounded-2xl p-4 text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />

                      {proofPreview ? (
                        <div className="flex items-center justify-between gap-4">
                          <img
                            src={proofPreview}
                            alt="Payment Proof Preview"
                            className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="text-left flex-grow">
                            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <FiCheck /> Payment Screenshot Attached
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {proofFile?.name || 'payment_screenshot.png'}
                            </p>
                          </div>
                          <span className="text-xs text-[#1a66ff] font-bold underline">Change</span>
                        </div>
                      ) : (
                        <div className="space-y-1 py-1">
                          <FiUploadCloud className="mx-auto text-[#1a66ff] text-2xl group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-slate-700">
                            Upload your eSewa payment screenshot
                          </p>
                          <p className="text-[10px] text-slate-400">
                            JPG, PNG, WEBP (Max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Order Summary & Submit Button */}
              <div className="lg:col-span-5 space-y-6 text-left">
                
                <div className="bg-[#f4f8fc] rounded-2xl p-6 border border-blue-100 shadow-sm space-y-5 sticky top-0">
                  <h4 className="font-extrabold text-slate-900 text-base tracking-tight pb-3 border-b border-blue-100">
                    Order Summary
                  </h4>

                  <div className="space-y-1 pb-3 border-b border-blue-100">
                    <p className="font-bold text-slate-900 text-sm">{itemName}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      Payment Gateway: eSewa QR
                    </p>
                  </div>

                  {/* Coupon Code */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      COUPON CODE
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <FiTag className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="CLICK10"
                          disabled={couponApplied}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1a66ff]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !coupon.trim()}
                        className="px-3.5 py-2 bg-[#1a66ff] hover:bg-[#1554d1] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <FiCheck /> 10% Discount Applied!
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-xs text-slate-600 border-t border-b border-blue-100 py-3.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-500">Amount to Pay:</span>
                      <span className="font-bold text-slate-900">NPR {subtotalNPR.toLocaleString()}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount (10%):</span>
                        <span>- NPR {Math.round(subtotalNPR * 0.1).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Final Total Cost */}
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-extrabold text-slate-900">
                      Final Total:
                    </span>
                    <span className="text-2xl font-black text-[#1a66ff]">
                      NPR {finalTotalNPR.toLocaleString()}
                    </span>
                  </div>

                  {/* Error Box */}
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <FiAlertCircle className="flex-shrink-0 text-base" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* SUBMIT PAYMENT Button */}
                  <button
                    type="submit"
                    disabled={submitting || uploadingProof}
                    className="w-full py-3.5 bg-[#1a66ff] hover:bg-[#1554d1] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Payment...</span>
                      </>
                    ) : (
                      <>
                        <FiShield size={16} />
                        <span>SUBMIT PAYMENT</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <FiLock className="text-amber-600" />
                    <span>Order becomes Pending Verification after submission</span>
                  </div>
                </div>

              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
