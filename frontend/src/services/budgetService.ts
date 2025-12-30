import { api } from './api';

export interface Budget {
  id: number;
  amount: number;
  category: string;
  month: string;
}

export interface CreateBudgetData {
  amount: number;
  category: string;
  month: string;
}

export interface BudgetAlerts {
  warnings: string[];
  errors: string[];
}

export const budgetService = {
  createBudget: async (data: CreateBudgetData): Promise<Budget> => {
    const response = await api.post<Budget>('/budgets', data);
    return response.data;
  },

  getBudgets: async (): Promise<Budget[]> => {
    try {
      console.log('Fetching budgets from API...');
      const token = localStorage.getItem('token');
      console.log('Token being used:', token ? 'Present' : 'Missing');
      const response = await api.get<Budget[]>('/budgets');
      console.log('Budgets API response status:', response.status);
      console.log('Budgets API response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching budgets:');
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getBudgetAlerts: async (month: string): Promise<BudgetAlerts> => {
    const response = await api.get<BudgetAlerts>(`/budgets/alerts/${month}`);
    return response.data;
  },

  updateBudget: async (id: number, data: Partial<CreateBudgetData>): Promise<Budget> => {
    const response = await api.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },
};