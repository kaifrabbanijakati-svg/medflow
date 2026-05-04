import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "􀉟" },
    { to: "/medicines", label: "Medicines", icon: "􀒓" },
    { to: "/billing", label: "Billing", icon: "􀖗" },
    { to: "/alerts", label: "Alerts", icon: "􀋚" },
  ];

  return (
    <div className="flex h-screen bg-dark text-textMain overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 glass border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between md:block mt-safe">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 flex items-center gap-2">
            <span className="text-primary">􀫊</span> MedFlow
          </h1>
          <button onClick={toggleSidebar} className="md:hidden text-textMuted hover:text-textMain">
            􀆄
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              onClick={() => setIsSidebarOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'hover:bg-white/5 text-textMuted hover:text-textMain'}`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium text-sm">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5 mb-safe">
          <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-danger hover:bg-danger/10 rounded-xl transition-colors font-medium text-sm">
            <span className="text-lg">􀆨</span>
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header - Glassmorphic */}
        <header className="h-16 absolute top-0 left-0 right-0 z-30 glass border-b border-white/5 flex items-center justify-between px-4 md:px-8 pt-safe">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden text-textMain p-2 -ml-2 rounded-lg hover:bg-white/10">
              􀏚
            </button>
            <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider hidden md:block">Workspace</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 shadow-lg shadow-primary/20 flex items-center justify-center text-white font-bold text-sm border border-white/20">
               A
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-20 px-4 md:px-8 pb-8 scroll-smooth">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
