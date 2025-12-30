import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  FOOD = 'Food',
  BILLS = 'Bills',
  SHOPPING = 'Shopping',
  SALARY = 'Salary',
  PETROL = 'Petrol',
  ENTERTAINMENT = 'Entertainment',
  HEALTHCARE = 'Healthcare',
  TRAVEL = 'Travel',
  OTHER = 'Other',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
  category: TransactionCategory;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @Column()
  userId: number;
}