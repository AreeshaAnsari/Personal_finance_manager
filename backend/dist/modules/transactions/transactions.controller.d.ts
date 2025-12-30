import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../../dtos/create-transaction.dto';
export declare class TransactionsController {
    private transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(createTransactionDto: CreateTransactionDto, user: any): Promise<import("../../entities/transaction.entity").Transaction>;
    getTransactionsByUser(user: any): Promise<import("../../entities/transaction.entity").Transaction[]>;
    getTransactionsByUserAndFilters(user: any, month?: string, category?: string, type?: string, search?: string): Promise<import("../../entities/transaction.entity").Transaction[]>;
    getMonthlyReport(user: any, month: string): Promise<{
        totalIncome: number;
        totalExpenses: number;
        balance: number;
        categoryExpenses: {
            category: string;
            amount: number;
        }[];
    }>;
    updateTransaction(id: string, updateTransactionDto: Partial<CreateTransactionDto>, user: any): Promise<import("../../entities/transaction.entity").Transaction>;
    deleteTransaction(id: string, user: any): Promise<void>;
}
