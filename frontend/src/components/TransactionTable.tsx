import React, { useState, useEffect } from 'react';
import { transactionService, Transaction, CreateTransactionData } from '../services/transactionService';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionUpdated: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onTransactionUpdated }) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CreateTransactionData>>({});
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Get unique categories from transactions
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  // Get unique months from transactions
  const months = Array.from(new Set(transactions.map(t => 
    new Date(t.date).toISOString().slice(0, 7)
  ))).sort().reverse();

  // Apply filters whenever filter values change
  useEffect(() => {
    const applyFilters = async () => {
      // If no filters are set, show all transactions
      if (!monthFilter && !categoryFilter && !typeFilter && !searchFilter) {
        setFilteredTransactions(transactions);
        setIsFiltering(false);
        return;
      }
      
      setIsFiltering(true);
      
      try {
        const filters: any = {};
        if (monthFilter) filters.month = monthFilter;
        if (categoryFilter) filters.category = categoryFilter;
        if (typeFilter) filters.type = typeFilter;
        if (searchFilter) filters.search = searchFilter;
        
        console.log('Applying filters:', filters);
        
        const filteredData = await transactionService.getFilteredTransactions(filters);
        console.log('Filtered transactions:', filteredData);
        setFilteredTransactions(filteredData);
      } catch (err) {
        console.error('Failed to fetch filtered transactions:', err);
        setError('Failed to fetch filtered transactions');
        setFilteredTransactions([]);
      } finally {
        setIsFiltering(false);
      }
    };
    
    applyFilters();
  }, [monthFilter, categoryFilter, typeFilter, searchFilter, transactions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    // Format as Rupees instead of USD
    return `Rs ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount))}`;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setLoading(id);
      try {
        await transactionService.deleteTransaction(id);
        onTransactionUpdated();
      } catch (err) {
        setError('Failed to delete transaction');
      } finally {
        setLoading(null);
      }
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    setLoading(editingTransaction.id);
    try {
      await transactionService.updateTransaction(editingTransaction.id, editFormData);
      setEditingTransaction(null);
      setEditFormData({});
      onTransactionUpdated();
    } catch (err) {
      setError('Failed to update transaction');
    } finally {
      setLoading(null);
    }
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    setEditFormData({});
  };

  // Clear all filters
  const clearFilters = () => {
    setMonthFilter('');
    setCategoryFilter('');
    setTypeFilter('');
    setSearchFilter('');
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Filter Controls */}
      <div className="p-4 bg-gray-750 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Month</label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Search</label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search description..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded transition duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {isFiltering ? (
        <div className="p-6 text-center text-gray-400">
          Loading filtered transactions...
        </div>
      ) : filteredTransactions.length === 0 && (monthFilter || categoryFilter || typeFilter || searchFilter) ? (
        <div className="p-6 text-center text-gray-400">
          No transactions found for the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delete</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  {editingTransaction?.id === transaction.id ? (
                    // Edit form row
                    <tr className="bg-gray-750">
                      <td colSpan={6} className="px-6 py-4">
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Date</label>
                              <input
                                type="date"
                                name="date"
                                value={editFormData.date || ''}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Amount</label>
                              <input
                                type="number"
                                name="amount"
                                value={editFormData.amount || ''}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                                required
                                step="0.01"
                                min="0"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Category</label>
                              <select
                                name="category"
                                value={editFormData.category || ''}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                              >
                                {categories.map((cat) => (
                                  <option key={cat} value={cat} className="bg-gray-700">{cat}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-gray-300 text-sm mb-1">Type</label>
                              <select
                                name="type"
                                value={editFormData.type || ''}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                              >
                                <option value="income" className="bg-gray-700">Income</option>
                                <option value="expense" className="bg-gray-700">Expense</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-gray-300 text-sm mb-1">Description</label>
                            <textarea
                              name="description"
                              value={editFormData.description || ''}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                              rows={2}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading === transaction.id}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
                            >
                              {loading === transaction.id ? 'Updating...' : 'Update'}
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    // Regular transaction row
                    <tr key={transaction.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          transaction.type === 'income' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount, transaction.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          disabled={loading === transaction.id}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-300 disabled:opacity-50"
                        >
                          {loading === transaction.id ? 'Deleting...' : 'Remove'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-300"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;