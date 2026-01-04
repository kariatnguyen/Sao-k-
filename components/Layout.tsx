
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Báo cáo', icon: 'fa-chart-line' },
    { id: 'upload' as ViewType, label: 'Quét Ảnh', icon: 'fa-qrcode' },
    { id: 'history' as ViewType, label: 'Lịch sử', icon: 'fa-history' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-coins text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">PiTracker</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-400 mb-1">Phiên bản</p>
            <p className="text-sm font-medium">v1.2.0 Pro</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Mobile & Title) */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h1 className="text-lg font-bold text-slate-800">
              {menuItems.find(m => m.id === currentView)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <i className="fa-solid fa-user text-slate-400 text-sm"></i>
            </div>
            <span className="text-sm font-medium text-slate-600 hidden sm:inline">Admin User</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Navbar */}
        <nav className="md:hidden bg-white border-t border-slate-200 h-16 flex items-center justify-around px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 ${
                currentView === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
