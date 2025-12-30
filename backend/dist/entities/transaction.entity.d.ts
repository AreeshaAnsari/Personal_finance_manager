import { User } from './user.entity';
export declare enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense"
}
export declare enum TransactionCategory {
    FOOD = "Food",
    BILLS = "Bills",
    SHOPPING = "Shopping",
    SALARY = "Salary",
    PETROL = "Petrol",
    ENTERTAINMENT = "Entertainment",
    HEALTHCARE = "Healthcare",
    TRAVEL = "Travel",
    OTHER = "Other"
}
export declare class Transaction {
    id: number;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: Date;
    description: string;
    createdAt: Date;
    user: User;
    userId: number;
}
