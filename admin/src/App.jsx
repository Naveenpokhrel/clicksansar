import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ServicesManager from './pages/ServicesManager';
import BlogsManager from './pages/BlogsManager';
import PortfolioManager from './pages/PortfolioManager';
import GalleryManager from './pages/GalleryManager';
import TestimonialsManager from './pages/TestimonialsManager';
import TeamManager from './pages/TeamManager';
import PricingManager from './pages/PricingManager';
import FaqManager from './pages/FaqManager';
import LeadsManager from './pages/LeadsManager';
import SettingsManager from './pages/SettingsManager';

// Protected Route Wrapper Component
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-64 flex flex-col min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-grow p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/services" element={<ServicesManager />} />
              <Route path="/blogs" element={<BlogsManager />} />
              <Route path="/portfolio" element={<PortfolioManager />} />
              <Route path="/gallery" element={<GalleryManager />} />
              <Route path="/testimonials" element={<TestimonialsManager />} />
              <Route path="/team" element={<TeamManager />} />
              <Route path="/pricing" element={<PricingManager />} />
              <Route path="/faqs" element={<FaqManager />} />
              <Route path="/leads" element={<LeadsManager />} />
              <Route path="/settings" element={<SettingsManager />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
