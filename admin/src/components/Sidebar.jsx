import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiMail,
  FiSettings,
  FiLayers,
} from 'react-icons/fi';

import ClickSansarLogo from './ClickSansarLogo';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiGrid },
    { name: 'Services', path: '/services', icon: FiLayers },
    { name: 'Leads & Inquiries', path: '/leads', icon: FiMail },
    { name: 'Site Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/80 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Header Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white">
          <NavLink to="/" className="flex items-center gap-2">
            <ClickSansarLogo size="small" />
            <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full">
              Admin
            </span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`
                }
              >
                <Icon className="text-lg flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-xs text-slate-400 text-center">
          Click Sansar CMS &copy; {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
