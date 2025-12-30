import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, budget => budget.user)
  budgets: Budget[];
}