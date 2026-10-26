import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCardDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}