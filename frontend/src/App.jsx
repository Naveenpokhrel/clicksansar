import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingButtons from './components/FloatingButtons/FloatingButtons';
import Chatbot from './components/Chatbot/Chatbot';
import { AuthProvider } from './context/AuthContext';

// Active Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';

// Client Auth & Dashboard Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ClientDashboard from './pages/Dashboard/ClientDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white">
          {/* Sticky Header */}
          <Navbar />

          {/* Dynamic Route Pages */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Client Auth & Dashboard */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ClientDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Utilities */}
          <FloatingButtons />
          <Chatbot />

          {/* Main Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
