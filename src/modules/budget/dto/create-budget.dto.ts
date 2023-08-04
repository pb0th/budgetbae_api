import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
