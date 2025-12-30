import { IsNumber, IsEnum, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { TransactionType, TransactionCategory } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(TransactionCategory)
  @IsNotEmpty()
  category: TransactionCategory;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsOptional()
  description?: string;
}