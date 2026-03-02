import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/\S/, {
    message: 'Password cannot contain only spaces',
  })
  password: string;
}
