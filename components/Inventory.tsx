import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Search, Wifi, WifiOff, Edit2, Trash2 } from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    // Simulate offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load from local storage (Offline First Principle)
    const stored = localStorage.getItem('tradesync_inventory');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      // Seed data
      const seed: Product[] = [
        { id: '1', name: 'Ankara Fabric (Yard)', sku: 'ANK-001', price: 4500, stock: 120, category: 'Textile' },
        { id: '2', name: 'Men Leather Sandals', sku: 'SH-004', price: 12000, stock: 15, category: 'Footwear' },
      ];
      setProducts(seed);
      localStorage.setItem('tradesync_inventory', JSON.stringify(seed));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      sku: newProduct.sku || `GEN-${Math.floor(Math.random() * 1000)}`,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock) || 0,
      category: newProduct.category || 'General',
      lastSynced: new Date().toISOString()
    };

    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem('tradesync_inventory', JSON.stringify(updated));
    setShowAddModal(false);
    setNewProduct({});
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('tradesync_inventory', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Cloud Synced' : 'Offline Mode (Local Storage)'}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Price (₦)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{p.name}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{p.sku}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">₦{p.price.toLocaleString()}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No products found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>
            <div className="space-y-3">
              <input 
                className="w-full p-2 border border-slate-200 rounded-lg" 
                placeholder="Product Name" 
                value={newProduct.name || ''}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
              <div className="flex gap-3">
                <input 
                  className="w-1/2 p-2 border border-slate-200 rounded-lg" 
                  placeholder="Price" 
                  type="number"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
                <input 
                  className="w-1/2 p-2 border border-slate-200 rounded-lg" 
                  placeholder="Stock Qty" 
                  type="number"
                  value={newProduct.stock || ''}
                  onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                />
              </div>
              <input 
                className="w-full p-2 border border-slate-200 rounded-lg" 
                placeholder="SKU (Optional)" 
                value={newProduct.sku || ''}
                onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
              />
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveProduct}
                  className="w-1/2 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;