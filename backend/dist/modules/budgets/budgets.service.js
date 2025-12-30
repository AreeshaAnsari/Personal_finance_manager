"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const budget_entity_1 = require("../../entities/budget.entity");
const user_entity_1 = require("../../entities/user.entity");
const transaction_entity_1 = require("../../entities/transaction.entity");
let BudgetsService = class BudgetsService {
    budgetsRepository;
    usersRepository;
    transactionsRepository;
    constructor(budgetsRepository, usersRepository, transactionsRepository) {
        this.budgetsRepository = budgetsRepository;
        this.usersRepository = usersRepository;
        this.transactionsRepository = transactionsRepository;
    }
    async createBudget(userId, createBudgetDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const monthDate = new Date(createBudgetDto.month);
        if (isNaN(monthDate.getTime())) {
            throw new Error('Invalid month format. Expected YYYY-MM');
        }
        const existingBudget = await this.budgetsRepository.findOne({
            where: {
                userId,
                category: createBudgetDto.category,
                month: monthDate
            }
        });
        if (existingBudget) {
            throw new Error(`Budget already exists for ${createBudgetDto.category} in ${createBudgetDto.month}. Use update instead.`);
        }
        const budget = this.budgetsRepository.create({
            amount: createBudgetDto.amount,
            category: createBudgetDto.category,
            month: monthDate,
            user,
            userId,
        });
        const savedBudget = await this.budgetsRepository.save(budget);
        return {
            ...savedBudget,
            month: savedBudget.month.toISOString().split('T')[0],
        };
    }
    async getBudgetsByUser(userId) {
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
                month: new Date(budget.month).toISOString().split('T')[0],
            }));
            console.log('Formatted budgets:', result);
            return result;
        }
        catch (error) {
            console.error('Error fetching budgets from database:', error);
            throw error;
        }
    }
    async checkBudgetAlerts(userId, month) {
        const budgets = await this.budgetsRepository
            .createQueryBuilder('budget')
            .where('budget.userId = :userId', { userId })
            .andWhere('TO_CHAR(budget.month, \'YYYY-MM\') = :month', { month })
            .getMany();
        const expenses = await this.transactionsRepository
            .createQueryBuilder('transaction')
            .where('transaction.userId = :userId', { userId })
            .andWhere('transaction.type = :type', { type: 'expense' })
            .andWhere('TO_CHAR(transaction.date, \'YYYY-MM\') = :month', { month })
            .getMany();
        const warnings = [];
        const errors = [];
        const categoryExpenses = {};
        expenses.forEach(expense => {
            if (!categoryExpenses[expense.category]) {
                categoryExpenses[expense.category] = 0;
            }
            categoryExpenses[expense.category] += Number(expense.amount);
        });
        budgets.forEach(budget => {
            const actualExpense = categoryExpenses[budget.category] || 0;
            const budgetAmount = Number(budget.amount);
            if (actualExpense >= budgetAmount) {
                errors.push(`Budget exceeded for ${budget.category}: Rs ${actualExpense.toFixed(2)} spent of Rs ${budgetAmount.toFixed(2)} budget`);
            }
            else if (actualExpense >= budgetAmount * 0.8) {
                warnings.push(`Near budget limit for ${budget.category}: Rs ${actualExpense.toFixed(2)} spent of Rs ${budgetAmount.toFixed(2)} budget`);
            }
        });
        return { warnings, errors };
    }
    async updateBudget(userId, budgetId, updateBudgetDto) {
        const budget = await this.budgetsRepository.findOne({
            where: { id: budgetId, userId },
        });
        if (!budget) {
            throw new Error('Budget not found');
        }
        if (updateBudgetDto.month) {
            const monthDate = new Date(updateBudgetDto.month);
            Object.assign(budget, { ...updateBudgetDto, month: monthDate });
        }
        else {
            Object.assign(budget, updateBudgetDto);
        }
        if (updateBudgetDto.category) {
            budget.category = updateBudgetDto.category;
        }
        const savedBudget = await this.budgetsRepository.save(budget);
        return {
            ...savedBudget,
            month: savedBudget.month.toISOString().split('T')[0],
        };
    }
    async deleteBudget(userId, budgetId) {
        const budget = await this.budgetsRepository.findOne({
            where: { id: budgetId, userId },
        });
        if (!budget) {
            throw new Error('Budget not found');
        }
        await this.budgetsRepository.remove(budget);
        return { message: 'Budget deleted successfully' };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(budget_entity_1.Budget)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map