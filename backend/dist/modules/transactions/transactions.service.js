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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../../entities/transaction.entity");
const user_entity_1 = require("../../entities/user.entity");
const budget_entity_1 = require("../../entities/budget.entity");
let TransactionsService = class TransactionsService {
    transactionsRepository;
    usersRepository;
    constructor(transactionsRepository, usersRepository) {
        this.transactionsRepository = transactionsRepository;
        this.usersRepository = usersRepository;
    }
    async createTransaction(userId, createTransactionDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (createTransactionDto.type === 'expense') {
            const currentDate = new Date(createTransactionDto.date);
            const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthlyReport = await this.getMonthlyReport(userId, month);
            if (createTransactionDto.amount > monthlyReport.balance) {
                throw new Error('Expense exceeds available income');
            }
            const categoryExpenses = await this.transactionsRepository
                .createQueryBuilder('transaction')
                .where('transaction.userId = :userId', { userId })
                .andWhere('transaction.type = :type', { type: 'expense' })
                .andWhere("TO_CHAR(transaction.date, 'YYYY-MM') = :month", { month })
                .andWhere('transaction.category = :category', { category: createTransactionDto.category })
                .getMany();
            let totalSpentInCategory = 0;
            categoryExpenses.forEach(expense => {
                totalSpentInCategory += Number(expense.amount);
            });
            const potentialTotalSpent = totalSpentInCategory + createTransactionDto.amount;
            const budgetRepository = this.transactionsRepository.manager.getRepository(budget_entity_1.Budget);
            const categoryBudget = await budgetRepository
                .createQueryBuilder('budget')
                .where('budget.userId = :userId', { userId })
                .andWhere("TO_CHAR(budget.month, 'YYYY-MM') = :month", { month })
                .andWhere('budget.category = :category', { category: createTransactionDto.category })
                .getOne();
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
    async getTransactionsByUser(userId) {
        return this.transactionsRepository.find({
            where: { userId },
            order: { date: 'DESC' },
        });
    }
    async getTransactionsByUserAndFilters(userId, filters) {
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
            queryBuilder.andWhere('(transaction.description ILIKE :search OR CAST(transaction.category AS TEXT) ILIKE :search OR CAST(transaction.amount AS TEXT) ILIKE :search)', { search: `%${filters.search}%` });
        }
        queryBuilder.orderBy('transaction.date', 'DESC');
        return queryBuilder.getMany();
    }
    async getMonthlyReport(userId, month) {
        const transactions = await this.transactionsRepository
            .createQueryBuilder('transaction')
            .where('transaction.userId = :userId', { userId })
            .andWhere('TO_CHAR(transaction.date, \'YYYY-MM\') = :month', { month })
            .getMany();
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryExpenses = {};
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += Number(transaction.amount);
            }
            else {
                totalExpenses += Number(transaction.amount);
                if (!categoryExpenses[transaction.category]) {
                    categoryExpenses[transaction.category] = 0;
                }
                categoryExpenses[transaction.category] += Number(transaction.amount);
            }
        });
        const balance = totalIncome - totalExpenses;
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
    async updateTransaction(userId, transactionId, updateTransactionDto) {
        const transaction = await this.transactionsRepository.findOne({
            where: { id: transactionId, userId },
        });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        Object.assign(transaction, updateTransactionDto);
        return this.transactionsRepository.save(transaction);
    }
    async deleteTransaction(userId, transactionId) {
        const transaction = await this.transactionsRepository.findOne({
            where: { id: transactionId, userId },
        });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        await this.transactionsRepository.remove(transaction);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map