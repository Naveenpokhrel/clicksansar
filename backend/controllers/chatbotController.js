const Service = require('../models/Service');
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
    if (text.includes('price') || text.includes('pricing') || text.includes('package') || text.includes('cost') || text.includes('rate') || text.includes('budget')) {
      reply = `Our pricing is customized to your campaign goals! For Meta Ads, campaigns start from as low as $10/day (Rs. 1,350/day). You can use our interactive Campaign Calculator on the Meta Ads page or contact us on WhatsApp for an instant custom quote.`;
      quickActions = ['Meta Ads Calculator', 'WhatsApp Us'];
    }
    // 2. Check for contact or location queries
    else if (text.includes('contact') || text.includes('address') || text.includes('location') || text.includes('phone') || text.includes('call') || text.includes('email') || text.includes('where') || text.includes('whatsapp')) {
      reply = `You can reach **Click Sansar** directly:\n` +
        `• 📞 **WhatsApp / Mobile:** ${settings.whatsapp || settings.phone || '9767620241'}\n` +
        `• ✉️ **Email:** ${settings.email || 'clicksansarofficial@gmail.com'}\n` +
        `• 📍 **Office:** ${settings.address || 'Kathmandu, Nepal'}\n\n` +
        `You can also use our Contact page or message Naveen Pokhrel on WhatsApp!`;
      quickActions = ['Contact Form', 'WhatsApp Chat'];
    }
    // 3. Check for services queries
    else if (text.includes('service') || text.includes('ads') || text.includes('marketing') || text.includes('facebook') || text.includes('instagram') || text.includes('video') || text.includes('content') || text.includes('web') || text.includes('boost')) {
      const services = await Service.find({ status: true });
      
      const matchedService = services.find(s => text.includes(s.title.toLowerCase()));
      if (matchedService) {
        reply = `Yes! We provide **${matchedService.title}**.\n\n${matchedService.shortDescription || ''}\n\nWould you like to book this service or chat on WhatsApp?`;
        quickActions = [`View ${matchedService.title}`, 'WhatsApp Us'];
      } else {
        reply = `At **Click Sansar**, we offer core digital solutions:\n` +
          `• 🎯 **Meta Ads & Boosting** (Facebook & Instagram Ads)\n` +
          `• 🎬 **Video Shoot & Editing** (Reels, TikTok & Commercials)\n` +
          `• ✍️ **Content Creation** (Graphics & Social Media)\n` +
          `• 👑 **Subscriptions** (Tools & Licences)\n` +
          `• 💻 **Website & App Development**\n\n` +
          `Which service can we help you with?`;
        quickActions = ['Meta Ads', 'Video Shoot', 'Website Dev'];
      }
    }
    // 4. Default fallback
    else {
      reply = `Hello! I am Clicky, the Click Sansar assistant. I can answer questions about our Meta Ads campaigns, video shoots, content creation, web development, and direct eSewa checkout.\n\nHow can I help you today?`;
      quickActions = ['Our Services', 'Get A Quote', 'WhatsApp Us'];
    }

    res.json({ reply, quickActions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatbotResponse,
};
