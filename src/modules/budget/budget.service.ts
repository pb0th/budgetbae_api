import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/shared/modules/users/users.service';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget) private budgetRepo: Repository<Budget>,

    private usersService: UsersService,
  ) {}

  //  create a new budget
  async create(
    { title, amount, startDate, endDate }: CreateBudgetDto,
    userId: number,
  ) {
    // construct the date properties from string into date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // if the end date is after/later than start date
    if (end > start) {
      const user = await this.usersService.findOne(userId);

      const newBudget = await this.budgetRepo.create({
        title,
        amount,
        remainingAmount: amount,
        startDate,
        endDate,

        user,
      });
      return await this.budgetRepo.save(newBudget);
    }
    // throws error if the end date is earlier than start date
    throw new BadRequestException('Invalid dates.');
  }

  // retrieve all budget records that belong to this user
  async findAll(userId: number) {
    return await this.budgetRepo.find({
      where: { user: { id: userId } },
    });
  }

  // find one budget record that belongs to this user
  async findOne(id: number, userId: number) {
    const budget = await this.budgetRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!budget) throw new NotFoundException('Budget Not Found');
    return budget;
  }

  // calculate how much money should the user spend per day to meet with their budget
  async getDailyLimit(id: number, userId: number) {
    const budget = await this.findOne(id, userId);
    // calculate the remaining days until the deadline of the budget
    const dateDifference = this.calculateDateDifferenceInDays(
      new Date(),
      new Date(budget.endDate),
    );
    //  calculate the daily limiy amount
    return Number((budget.remainingAmount / dateDifference).toFixed(2));
  }

  // update the budget
  async update(id: number, userId: number, updateBudgetDto: UpdateBudgetDto) {
    // get the budget record
    const budget = await this.findOne(id, userId);

    // if the newly input start date is later than the original end date, throw exception
    if (
      updateBudgetDto.startDate &&
      new Date(updateBudgetDto.startDate) > new Date(budget.endDate)
    )
      throw new BadRequestException('Invalid start date');
    // if the newly input end date is earlier than the original start date, throw exception
    if (
      updateBudgetDto.endDate &&
      new Date(updateBudgetDto.endDate) < new Date(budget.startDate)
    )
      throw new BadRequestException('Invalid end date');

    return await this.budgetRepo.update(
      { id, user: { id: userId } },
      { ...updateBudgetDto },
    );
  }

  async remove(id: number, userId: number) {
    return await this.budgetRepo.delete({ id, user: { id: userId } });
  }

  private calculateDateDifferenceInDays(
    startDate: Date,
    endDate: Date,
  ): number {
    // Calculate the difference in milliseconds
    const differenceInMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = differenceInMs / (24 * 60 * 60 * 1000);

    // Round the result to get an integer value
    return Math.round(differenceInDays);
  }
}
