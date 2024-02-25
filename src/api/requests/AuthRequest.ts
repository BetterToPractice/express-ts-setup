import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class RegisterRequest {
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(200)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginRequest {
  @IsEmail()
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(200)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
