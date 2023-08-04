import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { UsersModule } from 'src/shared/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), UsersModule],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
