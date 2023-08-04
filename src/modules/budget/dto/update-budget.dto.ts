import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
