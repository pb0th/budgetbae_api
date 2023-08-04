import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from 'src/shared/modules/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req) {
    return this.budgetService.create(createBudgetDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.budgetService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.budgetService.findOne(+id, req.user.id);
  }

  @Get('/:id/limit')
  getDailyLimit(@Param('id') id: string, @Request() req) {
    return this.budgetService.getDailyLimit(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Request() req,
  ) {
    return this.budgetService.update(+id, req.user.id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.budgetService.remove(+id, req.user.id);
  }
}
