import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-slate-100/50 transition-colors"
      >
        <span className="font-bold text-slate-800 text-sm sm:text-base">{question}</span>
        <span
          className={`w-6 h-6 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm text-blue-600 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <FiChevronDown />
        </span>
      </button>

      {/* Answer Area */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[300px] border-t border-slate-100' : 'max-h-0'
        }`}
      >
        <div className="p-6 text-slate-600 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
