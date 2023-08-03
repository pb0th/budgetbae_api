import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @NotContains(' ', { message: 'Username must not contain whitespace.' })
  username: string;

  @IsNotEmpty()
  @MinLength(8) // Minimum password length should be 8 characters
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
