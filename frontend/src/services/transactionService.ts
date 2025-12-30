import { api } from './api';

export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

export interface MonthlyReport {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryExpenses: { category: string; amount: number }[];
}

export const transactionService = {
  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },

  getFilteredTransactions: async (filters: {
    month?: string;
    category?: string;
    type?: string;
    search?: string;
  }): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get<Transaction[]>(`/transactions/filter?${params.toString()}`);
    return response.data;
  },

  getMonthlyReport: async (month: string): Promise<MonthlyReport> => {
    const response = await api.get<MonthlyReport>(`/transactions/report/${month}`);
    return response.data;
  },

  updateTransaction: async (id: number, data: Partial<CreateTransactionData>): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};