import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionStatus } from '../types';
import { Wallet, Package, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const data = [
  { name: 'Mon', value: 40000 },
  { name: 'Tue', value: 30000 },
  { name: 'Wed', value: 65000 },
  { name: 'Thu', value: 45000 },
  { name: 'Fri', value: 80000 },
  { name: 'Sat', value: 95000 },
  { name: 'Sun', value: 50000 },
];

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const pendingAmount = transactions
    .filter(t => t.status === TransactionStatus.LOCKED)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const completedAmount = transactions
    .filter(t => t.status === TransactionStatus.RELEASED && t.type === 'incoming')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <p className="text-slate-500">Welcome back, Lagos Fashion.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="text-emerald-600" size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">Available</span>
          </div>
          <p className="text-sm text-slate-500">Wallet Balance</p>
          <h3 className="text-2xl font-bold text-slate-800">₦ {completedAmount.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-100">Locked</span>
          </div>
          <p className="text-sm text-slate-500">In Escrow</p>
          <h3 className="text-2xl font-bold text-slate-800">₦ {pendingAmount.toLocaleString()}</h3>
          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
             <AlertCircle size={10} /> Pending delivery confirmation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500">Active Shipments</p>
          <h3 className="text-2xl font-bold text-slate-800">12</h3>
          <p className="text-xs text-green-600 mt-1">4 arriving today</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Weekly Transaction Volume</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.type === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {t.type === 'incoming' ? '+' : '-'}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{t.description}</p>
                  <p className="text-xs text-slate-400">{t.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 'incoming' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === 'incoming' ? '+' : '-'} ₦{t.amount.toLocaleString()}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  t.status === TransactionStatus.LOCKED ? 'bg-amber-100 text-amber-700' : 
                  t.status === TransactionStatus.RELEASED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;