
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const totalPi = transactions.reduce((sum, t) => sum + (t.piAmount || 0), 0);
    const totalUsdt = transactions.reduce((sum, t) => sum + (t.usdtAmount || 0), 0);
    const avgRate = transactions.length > 0 ? totalUsdt / totalPi : 0;
    
    return {
      count: transactions.length,
      pi: totalPi,
      usdt: totalUsdt,
      rate: avgRate
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Group by day for simple visualization
    const daily: Record<string, { date: string, pi: number, usdt: number }> = {};
    
    transactions.slice().sort((a, b) => a.createdAt - b.createdAt).forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      if (!daily[date]) daily[date] = { date, pi: 0, usdt: 0 };
      daily[date].pi += t.piAmount;
      daily[date].usdt += t.usdtAmount;
    });

    return Object.values(daily);
  }, [transactions]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng giao dịch', value: stats.count, icon: 'fa-file-invoice', color: 'bg-blue-600', trend: '+12%' },
          { label: 'Tổng Pi đã chuyển', value: stats.pi.toLocaleString(), suffix: ' PI', icon: 'fa-coins', color: 'bg-amber-500', trend: '+8%' },
          { label: 'Tổng USDT nhận', value: stats.usdt.toLocaleString(), suffix: ' $', icon: 'fa-dollar-sign', color: 'bg-emerald-600', trend: '+15%' },
          { label: 'Tỷ giá TB', value: stats.rate.toFixed(4), suffix: ' $/PI', icon: 'fa-chart-area', color: 'bg-indigo-600', trend: '-2%' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white`}>
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {item.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-slate-800">
              {item.value}<span className="text-sm font-semibold text-slate-400 ml-1">{item.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Biến động giao dịch</h3>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500">
              <option>7 ngày gần nhất</option>
              <option>30 ngày gần nhất</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pi" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPi)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <i className="fa-solid fa-chart-line text-6xl opacity-10"></i>
                <p>Chưa có dữ liệu giao dịch</p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Report */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Top USDT nhận được</h3>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-5)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="usdt" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">
                <p>Không có dữ liệu</p>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">Mục tiêu tháng</span>
               <span className="font-bold text-slate-800">45%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-indigo-600 h-2 rounded-full w-[45%]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
