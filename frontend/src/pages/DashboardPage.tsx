import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionService, Transaction } from '../services/transactionService';
import { budgetService, BudgetAlerts } from '../services/budgetService';
import TransactionTable from '../components/TransactionTable';
import TransactionForm from '../components/TransactionForm';
import ReportSummary from '../components/ReportSummary';
import BudgetAlertsComponent from '../components/BudgetAlerts';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlerts>({ warnings: [], errors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [transactionsData, alertsData] = await Promise.all([
        transactionService.getTransactions(), // Get all transactions initially
        budgetService.getBudgetAlerts(currentMonth),
      ]);
      
      setTransactions(transactionsData);
      setBudgetAlerts(alertsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTransactionCreated = () => {
    fetchData();
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">Finance Manager</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/budgets')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
            >
              Budgets
            </button>
            <span>Welcome, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex space-x-4">
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
            >
              {showForm ? 'Cancel' : 'Add Transaction'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <TransactionForm onTransactionCreated={handleTransactionCreated} />
          </div>
        )}

        <BudgetAlertsComponent alerts={budgetAlerts} />

        <ReportSummary month={currentMonth} />

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <TransactionTable transactions={transactions} onTransactionUpdated={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;