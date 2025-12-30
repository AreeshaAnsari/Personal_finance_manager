import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    transactions: Transaction[];
    budgets: Budget[];
}
