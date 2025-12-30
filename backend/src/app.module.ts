import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Budget } from './entities/budget.entity';

import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    // ✅ ENV FILE LOAD 
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ DATABASE CONFIG
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Transaction, Budget],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([User, Transaction, Budget]),

    // ✅ JWT CONFIG
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

    AuthModule,
    TransactionsModule,
    BudgetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
