import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  userIdentifier: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
}
