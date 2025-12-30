import { TransactionType, TransactionCategory } from '../entities/transaction.entity';
export declare class CreateTransactionDto {
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: Date;
    description?: string;
}
