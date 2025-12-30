import { Repository } from 'typeorm';
import { Budget } from '../../entities/budget.entity';
import { User } from '../../entities/user.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CreateBudgetDto } from '../../dtos/create-budget.dto';
export declare class BudgetsService {
    private budgetsRepository;
    private usersRepository;
    private transactionsRepository;
    constructor(budgetsRepository: Repository<Budget>, usersRepository: Repository<User>, transactionsRepository: Repository<Transaction>);
    createBudget(userId: number, createBudgetDto: CreateBudgetDto): Promise<any>;
    getBudgetsByUser(userId: number): Promise<any[]>;
    checkBudgetAlerts(userId: number, month: string): Promise<{
        warnings: string[];
        errors: string[];
    }>;
    updateBudget(userId: number, budgetId: number, updateBudgetDto: Partial<CreateBudgetDto>): Promise<any>;
    deleteBudget(userId: number, budgetId: number): Promise<{
        message: string;
    }>;
}
