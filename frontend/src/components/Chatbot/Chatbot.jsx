import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { getSettings, sendMessageToChatbot } from '../../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! Welcome to Click Sansar. How can we help grow your business online today?');
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data?.chatbotWelcome) {
          setWelcomeMessage(data.chatbotWelcome);
        }
      } catch (err) {
        console.error('Chatbot settings load error:', err);
      }
    };
    fetchSettings();
  }, []);

  // Initialize messages list with welcome message when chatbot is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: welcomeMessage,
          quickActions: ['Services List', 'View Pricing', 'Book Consultation'],
        },
      ]);
    }
  }, [isOpen, welcomeMessage]);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message to list
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessageToChatbot(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: response.reply,
          quickActions: response.quickActions || [],
        },
      ]);
    } catch (error) {
      console.error('Chatbot message send error:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having trouble connecting to my brain right now. Please try calling us directly or filling out our contact form!",
          quickActions: ['Contact Form'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    // Check if the action corresponds to page navigation
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('pricing') || lowerAction.includes('plan')) {
      navigate('/pricing');
      setIsOpen(false);
    } else if (lowerAction.includes('services') || lowerAction.includes('service')) {
      navigate('/services');
      setIsOpen(false);
    } else if (lowerAction.includes('contact') || lowerAction.includes('consultation') || lowerAction.includes('quote')) {
      navigate('/contact');
      setIsOpen(false);
    } else if (lowerAction.includes('whatsapp')) {
      // Trigger click on Whatsapp floating link or open directly
      window.open('https://wa.me/9779800000000', '_blank');
      setIsOpen(false);
    } else {
      // Send as chat query
      handleSend(action);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 font-sans">
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 relative border border-blue-500/20"
          title="Chat with Clicky"
        >
          <FiMessageCircle size={26} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/10">
                C
              </div>
              <div>
                <h4 className="font-bold text-sm">Clicky</h4>
                <p className="text-xs text-blue-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-ping" />
                  Online AI Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {/* Render message with line breaks support */}
                    {msg.text.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Quick Action suggestion buttons */}
                  {msg.sender === 'bot' && msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => handleQuickAction(action)}
                          className="px-3 py-1.5 text-xs font-semibold bg-white border border-blue-100 hover:border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about prices, ads, video shoots..."
              className="flex-1 px-4 py-2 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-full text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors flex-shrink-0"
              disabled={loading}
            >
              <FiSend size={18} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
