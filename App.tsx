import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Escrow from './components/Escrow';
import Logistics from './components/Logistics';
import Inventory from './components/Inventory';
import AiAdvisor from './components/AiAdvisor';
import { ViewState, Transaction, TransactionStatus } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Shared State (Lifted up for simple demo purposes)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '101', counterparty: 'customer1@gmail.com', amount: 45000, description: 'Lace Material Bundle', status: TransactionStatus.RELEASED, date: '2023-10-24', type: 'incoming' },
    { id: '102', counterparty: 'ShopRite Kano', amount: 120000, description: 'Bulk Shea Butter', status: TransactionStatus.LOCKED, date: '2023-10-26', type: 'incoming' },
    { id: '103', counterparty: 'Logistics Partner', amount: 2500, description: 'Delivery Fee', status: TransactionStatus.RELEASED, date: '2023-10-26', type: 'outgoing' },
  ]);

  // We need inventory state at App level for AI context, but for "Offline First" demo, 
  // the Inventory component manages its own state via localStorage. 
  // In a real app, we'd use a Context provider or Redux.
  // For this demo, we will pull from localStorage just for the AI advisor if needed, 
  // or pass a simple mock if localStorage is empty to the AI.
  const [mockInventoryForAI] = useState([
    { id: '1', name: 'Ankara Fabric', sku: 'ANK-001', price: 4500, stock: 120, category: 'Textile' },
  ]);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard transactions={transactions} />;
      case ViewState.ESCROW:
        return <Escrow transactions={transactions} onAddTransaction={handleAddTransaction} />;
      case ViewState.LOGISTICS:
        return <Logistics />;
      case ViewState.INVENTORY:
        return <Inventory />;
      case ViewState.AI_ADVISOR:
        return <AiAdvisor inventory={mockInventoryForAI} transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;