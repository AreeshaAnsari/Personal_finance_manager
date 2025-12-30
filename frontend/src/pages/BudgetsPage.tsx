import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { budgetService, Budget, CreateBudgetData } from '../services/budgetService';

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const navigate = useNavigate();

  const categories = [
    'Food', 'Bills', 'Shopping', 'Salary', 'Petrol', 
    'Entertainment', 'Healthcare', 'Travel', 'Other'
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      console.log('Fetching budgets...');
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      const data = await budgetService.getBudgets();
      console.log('Budgets fetched:', data);
      setBudgets(data);
      // Clear error when fetch is successful, regardless of data length
      setError('');
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const [duplicateBudget, setDuplicateBudget] = useState<Budget | null>(null);

  // Check for duplicates whenever category or month changes
  useEffect(() => {
    const checkForDuplicateBudget = (category: string, month: string): Budget | null => {
      return budgets.find(budget => 
        budget.category === category && budget.month === month
      ) || null;
    };

    if (!editingBudget) {
      const duplicate = checkForDuplicateBudget(category, month);
      setDuplicateBudget(duplicate);
      if (duplicate) {
        setAmount(duplicate.amount.toString());
      }
    } else {
      setDuplicateBudget(null);
    }
  }, [category, month, budgets, editingBudget, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const budgetData: CreateBudgetData = {
        amount: parseFloat(amount),
        category,
        month,
      };

      console.log('Submitting budget data:', budgetData);

      if (editingBudget || duplicateBudget) {
        // Update existing budget
        const budgetToUpdate = editingBudget || duplicateBudget;
        console.log('Updating budget:', budgetToUpdate?.id);
        await budgetService.updateBudget(budgetToUpdate!.id, budgetData);
      } else {
        // Create new budget
        console.log('Creating new budget');
        await budgetService.createBudget(budgetData);
      }

      console.log('Budget saved successfully');
      // Reset form and refresh budgets
      resetForm();
      fetchBudgets();
    } catch (err) {
      console.error('Error saving budget:', err);
      setFormError('Failed to save budget');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const resetForm = () => {
    setEditingBudget(null);
    setAmount('');
    setCategory('Food');
    setMonth(new Date().toISOString().slice(0, 7));
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    // Format as Rupees instead of USD
    return `Rs ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount))}`;
  };

  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CreateBudgetData>>({});

  const handleEditClick = (budget: Budget) => {
    setEditingBudgetId(budget.id);
    setEditFormData({
      amount: budget.amount,
      category: budget.category,
      month: budget.month,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent, budgetId: number) => {
    e.preventDefault();
    try {
      await budgetService.updateBudget(budgetId, editFormData);
      setEditingBudgetId(null);
      setEditFormData({});
      fetchBudgets();
    } catch (err) {
      setFormError('Failed to update budget');
    }
  };

  const cancelEdit = () => {
    setEditingBudgetId(null);
    setEditFormData({});
  };

  const formatDate = (dateString: string) => {
    // Handle both YYYY-MM format and YYYY-MM-DD format
    let date: Date;
    
    if (dateString.length === 7) {
      // If it's already in YYYY-MM format
      date = new Date(dateString + '-01');
    } else {
      // If it's in YYYY-MM-DD format
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">Budget Manager</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Back to Dashboard
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
          <h2 className="text-2xl font-bold">Monthly Budgets</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
          >
            {showForm ? 'Cancel' : 'Add Budget'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingBudget ? 'Edit Budget' : duplicateBudget ? 'Update Existing Budget' : 'Add New Budget'}
            </h3>
            
            {formError && (
              <div className="bg-red-500 text-white p-3 rounded mb-4">
                {formError}
              </div>
            )}
            
            {duplicateBudget && !editingBudget && (
              <div className="bg-yellow-500 text-gray-900 p-3 rounded mb-4">
                <strong>Budget already exists!</strong> You are updating the existing budget for {category} in {formatDate(month)}.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  <label htmlFor="month" className="block text-gray-300 mb-2">Month</label>
                  <input
                    type="month"
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                {formLoading ? 'Saving...' : (editingBudget || duplicateBudget ? 'Update Budget' : 'Add Budget')}
              </button>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {budgets.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No budgets found. Create your first budget!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Budget Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Budget Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delete</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {budgets.map((budget) => (
                    <>
                      {editingBudgetId === budget.id ? (
                        // Edit form row
                        <tr className="bg-gray-750">
                          <td colSpan={5} className="px-6 py-4">
                            <form onSubmit={(e) => handleEditSubmit(e, budget.id)} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-gray-300 text-sm mb-1">Month</label>
                                  <input
                                    type="month"
                                    name="month"
                                    value={editFormData.month || ''}
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
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
                                >
                                  Update Budget
                                </button>
                              </div>
                            </form>
                          </td>
                        </tr>
                      ) : (
                        // Regular budget row
                        <tr key={budget.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                              {budget.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(budget.month)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                            {formatCurrency(budget.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDelete(budget.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-300"
                            >
                              Remove
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditClick(budget)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-300"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;