import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingButtons from './components/FloatingButtons/FloatingButtons';
import Chatbot from './components/Chatbot/Chatbot';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Portfolio from './pages/Portfolio/Portfolio';
import Pricing from './pages/Pricing/Pricing';
import Blog from './pages/Blog/Blog';
import BlogDetail from './pages/Blog/BlogDetail';
import Gallery from './pages/Gallery/Gallery';
import Team from './pages/Team/Team';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Sticky Header */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>

        {/* Floating Utilities */}
        <FloatingButtons />
        <Chatbot />

        {/* Main Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
