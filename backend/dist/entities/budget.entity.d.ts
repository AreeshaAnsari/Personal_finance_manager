import { User } from './user.entity';
import { TransactionCategory } from './transaction.entity';
export declare class Budget {
    id: number;
    amount: number;
    category: TransactionCategory;
    month: Date;
    createdAt: Date;
    user: User;
    userId: number;
}
