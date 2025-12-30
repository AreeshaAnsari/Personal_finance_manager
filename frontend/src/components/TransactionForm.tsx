import React, { useState } from 'react';
import { transactionService, CreateTransactionData } from '../services/transactionService';

interface TransactionFormProps {
  onTransactionCreated: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionCreated }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food', 'Bills', 'Shopping', 'Salary', 'Petrol', 
    'Entertainment', 'Healthcare', 'Travel', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const transactionData: CreateTransactionData = {
        amount: parseFloat(amount),
        type,
        category,
        date,
        description,
      };

      await transactionService.createTransaction(transactionData);
      onTransactionCreated();
      
      // Reset form
      setAmount('');
      setDescription('');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="amount" className="block text-gray-300 mb-2">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
              required
              step="0.01"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-gray-300 mb-2">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="income" className="bg-gray-700">Income</option>
              <option value="expense" className="bg-gray-700">Expense</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-gray-300 mb-2">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-700">{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-gray-300 mb-2">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;