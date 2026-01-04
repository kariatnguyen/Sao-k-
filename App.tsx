
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Transaction, ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('pi_transactions');
      if (saved) {
        try {
          setTransactions(JSON.parse(saved));
        } catch (e) {
          console.error("Lỗi khi tải dữ liệu từ localStorage", e);
        }
      } else {
        // Nếu không có trong localStorage, thử tải từ file data.json
        try {
          const response = await fetch('./data.json');
          if (response.ok) {
            const data = await response.json();
            setTransactions(data);
            localStorage.setItem('pi_transactions', JSON.stringify(data));
          }
        } catch (error) {
          console.log("Không tìm thấy file data.json hoặc lỗi fetch, bắt đầu với mảng rỗng.");
        }
      }
    };

    loadData();
  }, []);

  // Save to storage
  const saveTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('pi_transactions', JSON.stringify(updated));
    setView('history'); 
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('pi_transactions', JSON.stringify(updated));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'upload':
        return <TransactionForm onSave={saveTransaction} />;
      case 'history':
        return <TransactionList transactions={transactions} onDelete={deleteTransaction} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
