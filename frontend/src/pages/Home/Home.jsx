import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiAward, FiUsers, FiTrendingUp, FiVideo, FiMessageCircle, FiClock } from 'react-icons/fi';
import { getServices, getPortfolios, getTestimonials, getPricing, getBlogs } from '../../services/api';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import PortfolioCard from '../../components/PortfolioCard/PortfolioCard';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';
import PricingCard from '../../components/PricingCard/PricingCard';
import BlogCard from '../../components/BlogCard/BlogCard';
import ContactForm from '../../components/ContactForm/ContactForm';

const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const totalSteps = duration / 16;
    const increment = end / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [servicesData, portfoliosData, testimonialsData, pricingData, blogsData] = await Promise.all([
          getServices(),
          getPortfolios(),
          getTestimonials(),
          getPricing(),
          getBlogs(),
        ]);
        setServices(servicesData.slice(0, 6)); // Display first 6 services
        setPortfolios(portfoliosData.slice(0, 3)); // Display first 3 projects
        setTestimonials(testimonialsData.slice(0, 3));
        setPricing(pricingData.slice(0, 3));
        setBlogs(blogsData.slice(0, 2)); // Display first 2 blogs
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };
    loadHomeData();
  }, []);

  const stats = [
    { value: 150, suffix: '+', label: 'Projects Completed', icon: <FiCheckCircle size={24} /> },
    { value: 98, suffix: '%', label: 'Happy Clients', icon: <FiUsers size={24} /> },
    { value: 100, suffix: 'K+', label: 'Monthly Reach', icon: <FiTrendingUp size={24} /> },
    { value: 50, suffix: 'M+', label: 'Ad Budget Managed', icon: <FiAward size={24} /> },
  ];

  const steps = [
    { num: '01', title: 'Consultation', desc: 'We audit your active pages and draft a customized strategy call.' },
    { num: '02', title: 'Planning', desc: 'Establish calendars, content vectors, targeting parameters, and budget models.' },
    { num: '03', title: 'Content Creation', desc: 'Our team designs post graphics, scripts videos, and builds page copy.' },
    { num: '04', title: 'Campaign Launch', desc: 'Configure target structures and publish highly optimized conversion ads.' },
    { num: '05', title: 'Optimization & Reporting', desc: 'Audit CTR values, adjust bid strategies, and issue performance logs.' },
  ];

  return (
    <div className="pt-24 space-y-24">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/50 to-white py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              ⚡ Top Digital Marketing Agency in Nepal
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Grow Your Business with Digital Marketing That <span className="text-blue-600 bg-clip-text">Delivers Results</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
              Click Sansar helps businesses increase visibility, generate high-quality client leads, and scale online sales through strategic marketing campaigns, cinematic videos, and optimized web design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/contact" className="px-8 py-4 rounded-full font-bold text-center text-sm uppercase tracking-wider blue-gradient shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
                Get Free Consultation
              </Link>
              <Link to="/portfolio" className="px-8 py-4 rounded-full font-bold text-center text-sm uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors">
                View Portfolio
              </Link>
            </div>
          </div>

          {/* Hero Mockup Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
            <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl p-4 shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                alt="Marketing growth chart mockup"
                className="rounded-2xl w-full h-[280px] object-cover"
              />
              <div className="mt-4 flex justify-between items-center px-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Campaign Roas</h4>
                  <p className="text-xs text-green-600 font-semibold">+340% Performance Lift</p>
                </div>
                <div className="px-3 py-1 bg-blue-50 rounded-full text-xs font-bold text-blue-600">
                  Live Analytics
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Trusted By Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Trusted by businesses across Nepal</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
          <span className="font-extrabold text-lg text-slate-500">Apex Consult</span>
          <span className="font-extrabold text-lg text-slate-500">Eco Nepal</span>
          <span className="font-extrabold text-lg text-slate-500">Sajha Store</span>
          <span className="font-extrabold text-lg text-slate-500">Chic Nepal</span>
          <span className="font-extrabold text-lg text-slate-500">Himalayan Brews</span>
          <span className="font-extrabold text-lg text-slate-500">Nirmal Tech</span>
        </div>
      </section>

      {/* 3. About Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
            alt="Click Sansar team brainstorming"
            className="rounded-3xl shadow-xl w-full max-h-[380px] object-cover border border-slate-100"
          />
        </div>
        <div className="space-y-6 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            We are click-driven creators scaling corporate identities online.
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Click Sansar is a digital marketing collective based in Kathmandu. We design premium conversion channels, manage paid ads budgets on Facebook & Instagram, capture vertical storytelling reels, and engineer secure business websites.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-sm">Transparency in Campaign Analytics Reports</span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 text-sm">Professional In-house Production Gear</span>
            </div>
          </div>
          <div className="pt-2">
            <Link to="/about" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-indigo-600 transition-colors">
              Learn More About Us <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Services Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What We Do Best</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Explore our specialized marketing and production fields optimized to scale up your monthly inquiries and brand engagement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
        <div className="text-center pt-4">
          <Link to="/services" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-indigo-600 transition-colors">
            View All Services <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* 5. Statistics Counters */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400 mb-2 border border-slate-700">
                {stat.icon}
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold">
                <Counter end={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why Digital Marketers Choose Click Sansar</h2>
          <p className="text-slate-600 leading-relaxed">
            Unlike generic web builders or template promoters, we design custom brand pipelines. We merge creative content with performance metrics so your investments lead directly to customer orders.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <FiCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Creative Blueprint</h4>
                <p className="text-slate-500 text-xs mt-1">Posts and copywriting tailored to local buying intents.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FiUsers className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Dedicated Team</h4>
                <p className="text-slate-500 text-xs mt-1">Experienced creators, photographers, and developers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FiClock className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Fast Communication</h4>
                <p className="text-slate-500 text-xs mt-1">Dedicated WhatsApp coordinate groups for daily checkups.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FiTrendingUp className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Conversion Focused</h4>
                <p className="text-slate-500 text-xs mt-1">High conversion setups that maximize advertising ROI.</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80"
            alt="Growth metrics graphs"
            className="rounded-3xl shadow-xl w-full max-h-[380px] object-cover"
          />
        </div>
      </section>

      {/* 7. Portfolio Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Recent Showcase Projects</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Check out some of our visual graphics, promotional videos, and responsive applications engineered for Nepali businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((project) => (
            <PortfolioCard key={project._id} project={project} />
          ))}
        </div>
        <div className="text-center pt-4">
          <Link to="/portfolio" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-indigo-600 transition-colors">
            View All Projects <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* 8. Our Process */}
      <section className="bg-slate-50 py-20 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Our Launch Workflow</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              We execute in transparent milestones, keeping you aligned on designs, creative formats, and analytics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 relative shadow-sm">
                <span className="text-3xl font-black text-blue-100 absolute top-4 right-4">{step.num}</span>
                <h3 className="font-bold text-slate-900 text-base mb-2 mt-4">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Slider */}
      {testimonials && testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Success Stories</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Read how click optimization and dynamic media campaigns drove sales and leads for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        </section>
      )}

      {/* 10. Packages Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Transparent Pricing Packages</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Choose a plan that fits your current operational budgets. We offer customizable options.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricing.map((plan) => (
            <PricingCard key={plan._id} plan={plan} />
          ))}
        </div>
      </section>

      {/* 11. Latest Blogs */}
      {blogs && blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Latest Articles & Guides</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Read our latest digital marketing, Reels content, and website strategy tips.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* 12. Contact CTA Form */}
      <section id="contact-cta" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ContactForm />
      </section>
    </div>
  );
};

export default Home;
