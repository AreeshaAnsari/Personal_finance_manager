import { Repository } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { CreateTransactionDto } from '../../dtos/create-transaction.dto';
export declare class TransactionsService {
    private transactionsRepository;
    private usersRepository;
    constructor(transactionsRepository: Repository<Transaction>, usersRepository: Repository<User>);
    createTransaction(userId: number, createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    getTransactionsByUser(userId: number): Promise<Transaction[]>;
    getTransactionsByUserAndFilters(userId: number, filters: {
        month?: string;
        category?: string;
        type?: string;
        search?: string;
    }): Promise<Transaction[]>;
    getMonthlyReport(userId: number, month: string): Promise<{
        totalIncome: number;
        totalExpenses: number;
        balance: number;
        categoryExpenses: {
            category: string;
            amount: number;
        }[];
    }>;
    updateTransaction(userId: number, transactionId: number, updateTransactionDto: Partial<CreateTransactionDto>): Promise<Transaction>;
    deleteTransaction(userId: number, transactionId: number): Promise<void>;
}
