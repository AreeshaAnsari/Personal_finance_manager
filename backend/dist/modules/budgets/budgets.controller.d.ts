import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from '../../dtos/create-budget.dto';
export declare class BudgetsController {
    private budgetsService;
    constructor(budgetsService: BudgetsService);
    createBudget(createBudgetDto: CreateBudgetDto, user: any): Promise<any>;
    getBudgetsByUser(user: any): Promise<any[]>;
    checkBudgetAlerts(user: any, month: string): Promise<{
        warnings: string[];
        errors: string[];
    }>;
    updateBudget(id: string, updateBudgetDto: Partial<CreateBudgetDto>, user: any): Promise<any>;
    deleteBudget(id: string, user: any): Promise<{
        message: string;
    }>;
}
