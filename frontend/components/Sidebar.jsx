import React from 'react'
import { Sun, Moon, LayoutGrid, Cpu, Wallet, PieChart, Settings, HelpCircle, LogOut } from 'lucide-react'

function SidebarItem({ icon: Icon, label, isActive }) {
  return (
    <div className="relative group flex items-center justify-center w-full">
      <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
        <Icon size={22} strokeWidth={2.5} />
      </button>
      {/* Tooltip Label */}
      <div className="absolute left-16 bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
        {label}
        {/* Arrow pointer */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-24 min-h-screen bg-background flex flex-col items-center py-8 border-r border-slate-200/50 relative z-10 hover:z-50">

      {/* Nav Actions */}
      <div className="flex flex-col gap-6 w-full items-center">
        <SidebarItem icon={Sun} label="Light Theme" isActive={false} />
        <SidebarItem icon={Moon} label="Dark Theme" isActive={false} />
      </div>

      <div className="w-8 h-[1px] bg-slate-200 my-6"></div>

      {/* Main Nav (MSME Features) */}
      <nav className="flex flex-col gap-5 w-full items-center flex-1">
        <SidebarItem icon={LayoutGrid} label="Dashboard Overview" isActive={true} />
        <SidebarItem icon={Cpu} label="ARENA (Lender Marketplace)" isActive={false} />
        <SidebarItem icon={Wallet} label="PULSE (Business Vitals)" isActive={false} />
        <SidebarItem icon={PieChart} label="SENTINEL (Fraud/Pre-NPA)" isActive={false} />
        <SidebarItem icon={Settings} label="System Settings" isActive={false} />
      </nav>

      {/* Footer Nav */}
      <div className="flex flex-col gap-5 w-full items-center mb-4">
        <SidebarItem icon={HelpCircle} label="Help & Support" isActive={false} />
        <SidebarItem icon={LogOut} label="Log Out" isActive={false} />
      </div>
    </aside>
  )
}
