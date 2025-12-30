import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { TransactionCategory } from './transaction.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
  category: TransactionCategory;

  @Column({ type: 'date' })
  month: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.budgets)
  user: User;

  @Column()
  userId: number;
}