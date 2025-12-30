import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from '../../dtos/create-budget.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';

@Controller('budgets')
@UseGuards(AuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  createBudget(
    @Body() createBudgetDto: CreateBudgetDto,
    @GetUser() user: any,
  ) {
    return this.budgetsService.createBudget(user.sub, createBudgetDto);
  }

  @Get()
  getBudgetsByUser(@GetUser() user: any) {
    return this.budgetsService.getBudgetsByUser(user.sub);
  }

  @Get('/alerts/:month')
  checkBudgetAlerts(
    @GetUser() user: any,
    @Param('month') month: string,
  ) {
    return this.budgetsService.checkBudgetAlerts(user.sub, month);
  }

  @Put(':id')
  updateBudget(
    @Param('id') id: string,
    @Body() updateBudgetDto: Partial<CreateBudgetDto>,
    @GetUser() user: any,
  ) {
    return this.budgetsService.updateBudget(user.sub, parseInt(id), updateBudgetDto);
  }

  @Delete(':id')
  deleteBudget(
    @Param('id') id: string,
    @GetUser() user: any,
  ) {
    return this.budgetsService.deleteBudget(user.sub, parseInt(id));
  }
}