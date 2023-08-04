import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: Date, args: ValidationArguments) {
    console.log('validating');
    const startDate = args.object['startDate'] as Date;
    return endDate > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End date must be after the start date';
  }
}
