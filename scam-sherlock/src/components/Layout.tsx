
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Search, FileText, Menu, X, GraduationCap, Send, Activity, User, Database } from 'lucide-react';

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'The Scanner', path: '/', icon: Search },
    { name: 'Threat Ledger', path: '/map', icon: Database },
    { name: 'The Wiretap', path: '/wiretap', icon: FileText },
    { name: 'Training Dossier', path: '/training', icon: GraduationCap },
    { name: 'The Dispatcher', path: '/dispatch', icon: Send },
    { name: 'Analytics Board', path: '/analytics', icon: Activity },
    { name: 'Agent Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-noir-bg text-text-primary font-sans selection:bg-trenchcoat selection:text-noir-bg flex">
      <div className="bg-grain"></div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-noir-bg/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-72 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-trenchcoat/10 border border-trenchcoat/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-trenchcoat">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span className="text-lg font-bold font-sherlock tracking-widest uppercase text-text-primary">
              Scam<span className="text-trenchcoat drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]">Sherlock</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-trenchcoat/10 text-trenchcoat border border-trenchcoat/20 shadow-[0_0_15px_rgba(255,184,0,0.1)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="relative z-10">{item.name}</span>
              
              {/* Active Indicator Pulse */}
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-trenchcoat opacity-0 transition-opacity duration-300 [.active_&]:opacity-100 animate-pulse" />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-trenchcoat animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-xs font-mono text-trenchcoat font-bold tracking-wider">SYSTEM ONLINE</span>
                    <span className="text-[10px] text-text-muted">v2.0.4 &middot; STABLE</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto h-screen scroll-smooth">
          <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-full pb-24">
            <Outlet />
          </div>

          {/* Floating Mobile Toggle (Hidden on desktop) */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-trenchcoat text-noir-bg flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(255,184,0,0.4)]"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </main>
    </div>
  );
}
