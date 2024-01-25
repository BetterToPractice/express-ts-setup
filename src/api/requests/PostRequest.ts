import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class PostCreateRequest {
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(1200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class PostUpdateRequest {
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  title: string;

  @MaxLength(1200)
  @MinLength(10)
  @IsString()
  body: string;
}
