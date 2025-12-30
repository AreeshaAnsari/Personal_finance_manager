import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Budget } from '../../entities/budget.entity';
import { User } from '../../entities/user.entity';
import { Transaction } from '../../entities/transaction.entity';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, User, Transaction]),
    JwtModule.register({
      secret: 'finance_manager_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [BudgetsService],
  controllers: [BudgetsController],
  exports: [BudgetsService],
})
export class BudgetsModule {}