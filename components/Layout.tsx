import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Truck, 
  Package, 
  Bot, 
  Menu, 
  X,
  CheckCircle2
} from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.ESCROW, label: 'Smart Escrow', icon: ShieldCheck },
    { id: ViewState.LOGISTICS, label: 'Logistics', icon: Truck },
    { id: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { id: ViewState.AI_ADVISOR, label: 'AI Advisor', icon: Bot },
  ];

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="font-bold text-lg text-emerald-900">TradeSync</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop) / Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">TradeSync</h1>
            <p className="text-xs text-slate-400">Nigeria</p>
          </div>
        </div>

        <div className="px-6 py-4">
           <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3 border border-slate-700">
             <div className="relative">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-10 h-10 rounded-full border-2 border-emerald-500" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-100" />
                </div>
             </div>
             <div>
                <p className="text-sm font-semibold">Lagos Fashion</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">Verified Merchant</p>
             </div>
           </div>
        </div>

        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${currentView === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-100 mb-2">Trust Score</p>
            <div className="text-2xl font-bold text-white">98/100</div>
            <p className="text-[10px] text-emerald-100 opacity-80 mt-1">Excellent Reputation</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav (Mobile Only - highly common in Nigerian apps) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 pb-safe z-30 shadow-lg">
         {navItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-1 ${currentView === item.id ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label === 'Smart Escrow' ? 'Escrow' : item.label}</span>
            </button>
         ))}
      </div>
    </div>
  );
};

export default Layout;