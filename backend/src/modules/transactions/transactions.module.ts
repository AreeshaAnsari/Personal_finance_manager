import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User]),
    JwtModule.register({
      secret: 'finance_manager_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}