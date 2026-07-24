const Service = require('../models/Service');
const Pricing = require('../models/Pricing');
const FAQ = require('../models/FAQ');
const Setting = require('../models/Setting');

// @desc    Process chatbot message and return custom matching response
// @route   POST /api/chatbot
// @access  Public
const getChatbotResponse = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ reply: 'Please say something!' });
  }

  try {
    const text = message.toLowerCase();
    let reply = '';
    let quickActions = [];

    // Load global settings for contacts
    let settings = await Setting.findOne();
    if (!settings) settings = {};

    // 1. Check for pricing queries
    if (text.includes('price') || text.includes('pricing') || text.includes('package') || text.includes('cost') || text.includes('rate')) {
      const plans = await Pricing.find({});
      if (plans && plans.length > 0) {
        reply = `We offer multiple tailored packages for different budgets. Here are our main plans:\n\n` + 
          plans.map(p => `• **${p.name}**: ${p.price}/${p.period} - includes: ${p.features.slice(0, 3).join(', ')}...`).join('\n') +
          `\n\nWould you like me to guide you to our Pricing page for more details?`;
        quickActions = ['View Pricing Page', 'Book Consultation'];
      } else {
        reply = `Our pricing plans are customized based on project scope. Generally, we offer Starter, Professional, and Premium packages. You can visit our Pricing page or request a Free Consultation to get an exact quote!`;
        quickActions = ['Book Consultation'];
      }
    }
    // 2. Check for contact or location queries
    else if (text.includes('contact') || text.includes('address') || text.includes('location') || text.includes('phone') || text.includes('call') || text.includes('email') || text.includes('where')) {
      reply = `You can reach **Click Sansar** through the following channels:\n` +
        `• 📞 **Phone:** ${settings.phone || '+977-9800000000'}\n` +
        `• ✉️ **Email:** ${settings.email || 'info@clicksansar.com'}\n` +
        `• 📍 **Office:** ${settings.address || 'Kathmandu, Nepal'}\n\n` +
        `You can also fill out the form on our Contact page and our executive will reach out to you within 24 hours!`;
      quickActions = ['Contact Form', 'WhatsApp Chat'];
    }
    // 3. Check for specific services queries
    else if (text.includes('service') || text.includes('ads') || text.includes('marketing') || text.includes('facebook') || text.includes('instagram') || text.includes('video') || text.includes('seo') || text.includes('web') || text.includes('design')) {
      const services = await Service.find({ status: true });
      
      // Look for a specific service title match
      const matchedService = services.find(s => text.includes(s.title.toLowerCase()));
      if (matchedService) {
        reply = `Yes! We provide **${matchedService.title}**.\n\n${matchedService.shortDescription}\n\nKey benefits include:\n` +
          matchedService.benefits.map(b => `• ${b}`).join('\n') +
          `\n\nWould you like to book a free strategy call for this service?`;
        quickActions = [`Inquire about ${matchedService.title}`, 'Book Consultation'];
      } else if (services && services.length > 0) {
        reply = `At **Click Sansar**, we help you grow with premium digital services:\n\n` +
          services.slice(0, 5).map(s => `• **${s.title}**: ${s.shortDescription}`).join('\n') +
          `\n\nWe also offer video shoot/editing, branding, SEO, TikTok/YouTube marketing, and custom web development.`;
        quickActions = ['View All Services', 'Book Consultation'];
      } else {
        reply = `We provide standard digital marketing services, including Meta Ads, Social Media Management, Video Production, Branding, Graphic Design, Website Development, and SEO. What specific area are you looking to improve?`;
        quickActions = ['Book Consultation'];
      }
    }
    // 4. Check for FAQs match
    else {
      const faqs = await FAQ.find({});
      let bestMatch = null;
      for (const faq of faqs) {
        if (text.includes(faq.question.toLowerCase())) {
          bestMatch = faq;
          break;
        }
      }

      if (bestMatch) {
        reply = bestMatch.answer;
      } else {
        // General welcome fallback
        reply = `I am Clicky, the Click Sansar AI assistant. I can help answer questions about our digital marketing campaigns, prices, services, and locations. \n\nHow can I support your business growth online today?`;
        quickActions = ['Services List', 'Get Free Quote', 'Talk to Human'];
      }
    }

    res.json({ reply, quickActions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatbotResponse,
};
