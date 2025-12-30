import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../../entities/budget.entity';
import { User } from '../../entities/user.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CreateBudgetDto } from '../../dtos/create-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async createBudget(
    userId: number,
    createBudgetDto: CreateBudgetDto,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Validate and parse month
    const monthDate = new Date(createBudgetDto.month);
    if (isNaN(monthDate.getTime())) {
      throw new Error('Invalid month format. Expected YYYY-MM');
    }

    // Check for duplicate budget
    const existingBudget = await this.budgetsRepository.findOne({
      where: { 
        userId,
        category: createBudgetDto.category as any,
        month: monthDate
      }
    });

    if (existingBudget) {
      throw new Error(`Budget already exists for ${createBudgetDto.category} in ${createBudgetDto.month}. Use update instead.`);
    }

    const budget = this.budgetsRepository.create({
      amount: createBudgetDto.amount,
      category: createBudgetDto.category as any,
      month: monthDate,
      user,
      userId,
    });

    const savedBudget = await this.budgetsRepository.save(budget);
    return {
      ...savedBudget,
      month: (savedBudget as any).month.toISOString().split('T')[0],
    };
  }

  async getBudgetsByUser(userId: number): Promise<any[]> {
    console.log('Fetching budgets for user ID:', userId);
    try {
      const budgets = await this.budgetsRepository.find({
        where: { userId },
        order: { month: 'DESC' },
      });
      console.log('Budgets found in database:', budgets);
      
      if (!budgets || budgets.length === 0) {
        console.log('No budgets found for user ID:', userId);
        return [];
      }
      
      const result = budgets.map(budget => ({
        ...budget,
        month: new Date(budget.month).toISOString().split('T')[0], // Convert to YYYY-MM-DD
      }));
      console.log('Formatted budgets:', result);
      return result;
    } catch (error) {
      console.error('Error fetching budgets from database:', error);
      throw error;
    }
  }

  async checkBudgetAlerts(
    userId: number,
    month: string,
  ): Promise<{ warnings: string[]; errors: string[] }> {
    // Get all budgets for the user in the specified month
    const budgets = await this.budgetsRepository
      .createQueryBuilder('budget')
      .where('budget.userId = :userId', { userId })
      .andWhere('TO_CHAR(budget.month, \'YYYY-MM\') = :month', { month })
      .getMany();

    // Get all expenses for the user in the specified month
    const expenses = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'expense' })
      .andWhere('TO_CHAR(transaction.date, \'YYYY-MM\') = :month', { month })
      .getMany();

    const warnings: string[] = [];
    const errors: string[] = [];

    // Group expenses by category
    const categoryExpenses: { [key: string]: number } = {};

    expenses.forEach(expense => {
      if (!categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] = 0;
      }
      categoryExpenses[expense.category] += Number(expense.amount);
    });

    // Check each budget against actual expenses
    budgets.forEach(budget => {
      const actualExpense = categoryExpenses[budget.category] || 0;
      const budgetAmount = Number(budget.amount);

      if (actualExpense >= budgetAmount) {
        errors.push(
          `Budget exceeded for ${budget.category}: Rs ${actualExpense.toFixed(2)} spent of Rs ${budgetAmount.toFixed(2)} budget`,
        );
      } else if (actualExpense >= budgetAmount * 0.8) {
        warnings.push(
          `Near budget limit for ${budget.category}: Rs ${actualExpense.toFixed(2)} spent of Rs ${budgetAmount.toFixed(2)} budget`,
        );
      }
    });

    return { warnings, errors };
  }

  async updateBudget(
    userId: number,
    budgetId: number,
    updateBudgetDto: Partial<CreateBudgetDto>,
  ): Promise<any> {
    const budget = await this.budgetsRepository.findOne({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    // Handle month conversion if provided
    if (updateBudgetDto.month) {
      const monthDate = new Date(updateBudgetDto.month);
      Object.assign(budget, { ...updateBudgetDto, month: monthDate });
    } else {
      Object.assign(budget, updateBudgetDto);
    }
    
    // Handle category if provided
    if (updateBudgetDto.category) {
      budget.category = updateBudgetDto.category as any;
    }

    const savedBudget = await this.budgetsRepository.save(budget);
    return {
      ...savedBudget,
      month: (savedBudget as any).month.toISOString().split('T')[0],
    };
  }

  async deleteBudget(userId: number, budgetId: number): Promise<{ message: string }> {
    const budget = await this.budgetsRepository.findOne({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    await this.budgetsRepository.remove(budget);
    return { message: 'Budget deleted successfully' };
  }
}