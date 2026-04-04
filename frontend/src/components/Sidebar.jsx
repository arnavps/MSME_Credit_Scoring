import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Gavel,
  Map,
  User,
  Zap,
  LogOut,
  LayoutDashboard,
  FlaskConical
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', end: true },
  { icon: Activity, label: 'Pulse', path: '/dashboard/pulse' },
  { icon: ShieldCheck, label: 'Sentinel', path: '/dashboard/sentinel' },
  { icon: Gavel, label: 'Arena', path: '/dashboard/arena' },
  { icon: Map, label: 'Network', path: '/dashboard/network' },
  { icon: FlaskConical, label: 'Model Labs', path: '/dashboard/model-labs' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 hover:w-64 group transition-all duration-500 z-50">
      <div className="h-full bg-white/80 backdrop-blur-md border-r border-white/20 rounded-r-[32px] shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] flex flex-col items-center py-8 overflow-hidden transition-all duration-500">

        {/* Logo Section */}
        <NavLink to="/" className="mb-12 flex items-center justify-center px-4 w-full">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="ml-4 font-black text-slate-800 text-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-tighter">
            CREDNEXIS <span className="text-primary">AI</span>
          </span>
        </NavLink>

        {/* Navigation Items */}
        <nav className="flex-1 w-full px-4 space-y-4">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex items-center p-3 rounded-2xl transition-all duration-300 group/item relative",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <item.icon size={24} className="min-w-[24px]" />
                <span className="ml-4 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>

                {/* Visual Hint for SaaS functionality */}
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

        {/* Logout & User context */}
        <div className="mt-auto w-full px-4 space-y-3">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 w-full group/logout"
          >
            <LogOut size={24} className="min-w-[24px]" />
            <span className="ml-4 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Logout
            </span>
          </button>

          {/* User context */}
          <div className="flex items-center p-2 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 overflow-hidden flex-shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
            <div className="ml-3 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="font-black text-[10px] text-slate-800 truncate uppercase tracking-widest">Insignia Node</p>
              <p className="text-[10px] text-primary font-bold truncate">Secure Link</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
