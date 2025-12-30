import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { TransactionCategory } from '../entities/transaction.entity';

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  month: string;
}