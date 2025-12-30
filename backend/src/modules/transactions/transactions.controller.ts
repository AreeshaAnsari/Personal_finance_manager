import { Controller, Post, Put, Delete, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from '../../dtos/create-transaction.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: any,
  ) {
    return this.transactionsService.createTransaction(
      user.sub,
      createTransactionDto,
    );
  }

  @Get()
  getTransactionsByUser(@GetUser() user: any) {
    return this.transactionsService.getTransactionsByUser(user.sub);
  }

  @Get('/filter')
  getTransactionsByUserAndFilters(
    @GetUser() user: any,
    @Query('month') month?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    return this.transactionsService.getTransactionsByUserAndFilters(user.sub, {
      month,
      category,
      type,
      search,
    });
  }

  @Get('/report/:month')
  getMonthlyReport(
    @GetUser() user: any,
    @Param('month') month: string,
  ) {
    return this.transactionsService.getMonthlyReport(user.sub, month);
  }

  @Put(':id')
  updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: Partial<CreateTransactionDto>,
    @GetUser() user: any,
  ) {
    return this.transactionsService.updateTransaction(user.sub, parseInt(id), updateTransactionDto);
  }

  @Delete(':id')
  deleteTransaction(
    @Param('id') id: string,
    @GetUser() user: any,
  ) {
    return this.transactionsService.deleteTransaction(user.sub, parseInt(id));
  }
}