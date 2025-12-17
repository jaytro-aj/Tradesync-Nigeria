import React, { useState } from 'react';
import { Transaction, TransactionStatus } from '../types';
import { Lock, CheckCircle, ArrowRight, Shield } from 'lucide-react';

interface EscrowProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const Escrow: React.FC<EscrowProps> = ({ transactions, onAddTransaction }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    counterparty: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: Number(formData.amount),
      description: formData.description,
      counterparty: formData.counterparty,
      status: TransactionStatus.LOCKED,
      date: new Date().toLocaleDateString(),
      type: 'incoming' // Assuming we are the merchant requesting payment
    };
    onAddTransaction(newTransaction);
    setShowForm(false);
    setFormData({ amount: '', description: '', counterparty: '' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smart Escrow</h2>
          <p className="text-slate-500 text-sm">Funds held securely until delivery is confirmed.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-200"
        >
          New Transaction
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold">Create Escrow Link</h3>
               <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">Close</button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Customer Email/Phone</label>
                 <input 
                    required
                    type="text" 
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="+234..."
                    value={formData.counterparty}
                    onChange={e => setFormData({...formData, counterparty: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Amount (NGN)</label>
                 <input 
                    required
                    type="number" 
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Item Description</label>
                 <input 
                    required
                    type="text" 
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 20 yards Ankara fabric"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
               </div>

               <div className="bg-emerald-50 p-4 rounded-lg flex gap-3 items-start">
                  <Shield className="text-emerald-600 shrink-0" size={20} />
                  <p className="text-xs text-emerald-800">
                    TradeSync Guarantee: Funds are locked in a CBN-licensed vault. They are only released to your wallet when the customer or logistics partner confirms receipt.
                  </p>
               </div>

               <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">
                 Generate Payment Link
               </button>
             </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Escrows */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Active Escrows (Locked Funds)</h3>
          {transactions.filter(t => t.status === TransactionStatus.LOCKED).length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-400 border border-slate-100 border-dashed">
              No active escrow transactions.
            </div>
          ) : (
             transactions.filter(t => t.status === TransactionStatus.LOCKED).map(t => (
               <div key={t.id} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                   LOCKED
                 </div>
                 <div className="flex items-center gap-3 mb-3">
                   <div className="bg-amber-50 p-2 rounded-full">
                     <Lock size={18} className="text-amber-600" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800">₦ {t.amount.toLocaleString()}</p>
                     <p className="text-xs text-slate-500">{t.description}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between mt-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <span>Waiting for delivery</span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-amber-400 animate-pulse"></div>
                      </div>
                    </div>
                    <button className="text-emerald-600 font-medium hover:underline">Track Order</button>
                 </div>
               </div>
             ))
          )}
        </div>

        {/* History */}
        <div className="space-y-4">
           <h3 className="font-semibold text-slate-700">Released Funds History</h3>
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {transactions.filter(t => t.status === TransactionStatus.RELEASED).map(t => (
                <div key={t.id} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-400">{t.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">₦{t.amount.toLocaleString()}</span>
                </div>
              ))}
              {transactions.filter(t => t.status === TransactionStatus.RELEASED).length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No released funds yet.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Escrow;