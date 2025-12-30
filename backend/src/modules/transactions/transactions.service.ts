import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { Budget } from '../../entities/budget.entity';
import { CreateTransactionDto } from '../../dtos/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // For expense transactions, validate against income and budget
    if (createTransactionDto.type === 'expense') {
      // Get current month
      const currentDate = new Date(createTransactionDto.date);
      const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Get monthly report to check available income
      const monthlyReport = await this.getMonthlyReport(userId, month);
      
      // Income validation check
      if (createTransactionDto.amount > monthlyReport.balance) {
        throw new Error('Expense exceeds available income');
      }
      
      // Budget validation check
      // Get all expenses for the user in the specified month and category
      const categoryExpenses = await this.transactionsRepository
        .createQueryBuilder('transaction')
        .where('transaction.userId = :userId', { userId })
        .andWhere('transaction.type = :type', { type: 'expense' })
        .andWhere("TO_CHAR(transaction.date, 'YYYY-MM') = :month", { month })
        .andWhere('transaction.category = :category', { category: createTransactionDto.category })
        .getMany();
      
      // Calculate total spent in this category
      let totalSpentInCategory = 0;
      categoryExpenses.forEach(expense => {
        totalSpentInCategory += Number(expense.amount);
      });
      
      // Add the new expense amount to check against budget
      const potentialTotalSpent = totalSpentInCategory + createTransactionDto.amount;
      
      // Get budget for this category and month
      const budgetRepository = this.transactionsRepository.manager.getRepository(Budget);
      const categoryBudget = await budgetRepository
        .createQueryBuilder('budget')
        .where('budget.userId = :userId', { userId })
        .andWhere("TO_CHAR(budget.month, 'YYYY-MM') = :month", { month })
        .andWhere('budget.category = :category', { category: createTransactionDto.category })
        .getOne();
      
      // If budget exists, check if expense would exceed it
      if (categoryBudget && potentialTotalSpent > Number(categoryBudget.amount)) {
        throw new Error(`Expense exceeds monthly budget for ${createTransactionDto.category}`);
      }
    }

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      user,
      userId,
    });

    return this.transactionsRepository.save(transaction);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async getTransactionsByUserAndFilters(
    userId: number,
    filters: {
      month?: string;
      category?: string;
      type?: string;
      search?: string;
    },
  ): Promise<Transaction[]> {
    const queryBuilder = this.transactionsRepository.createQueryBuilder('transaction');

    queryBuilder.where('transaction.userId = :userId', { userId });

    if (filters.month) {
      queryBuilder.andWhere('TO_CHAR(transaction.date, \'YYYY-MM\') = :month', {
        month: filters.month,
      });
    }

    if (filters.category) {
      queryBuilder.andWhere('transaction.category = :category', {
        category: filters.category,
      });
    }

    if (filters.type) {
      queryBuilder.andWhere('transaction.type = :type', {
        type: filters.type,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(transaction.description ILIKE :search OR CAST(transaction.category AS TEXT) ILIKE :search OR CAST(transaction.amount AS TEXT) ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('transaction.date', 'DESC');

    return queryBuilder.getMany();
  }

  async getMonthlyReport(
    userId: number,
    month: string,
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    categoryExpenses: { category: string; amount: number }[];
  }> {
    // Get all transactions for the user in the specified month
    const transactions = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('TO_CHAR(transaction.date, \'YYYY-MM\') = :month', { month })
      .getMany();

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;

    // Group expenses by category
    const categoryExpenses: { [key: string]: number } = {};

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += Number(transaction.amount);
      } else {
        totalExpenses += Number(transaction.amount);
        
        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = 0;
        }
        categoryExpenses[transaction.category] += Number(transaction.amount);
      }
    });

    const balance = totalIncome - totalExpenses;

    // Convert categoryExpenses object to array
    const categoryExpensesArray = Object.keys(categoryExpenses).map(category => ({
      category,
      amount: categoryExpenses[category],
    }));

    return {
      totalIncome,
      totalExpenses,
      balance,
      categoryExpenses: categoryExpensesArray,
    };
  }

  async updateTransaction(
    userId: number,
    transactionId: number,
    updateTransactionDto: Partial<CreateTransactionDto>,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId, userId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  async deleteTransaction(userId: number, transactionId: number): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId, userId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionsRepository.remove(transaction);
  }
}