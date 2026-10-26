import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto.js';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/* export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imagesId?: string;
} */

export class AdditionalCard {
  @IsOptional()
  @IsString()
  imagesId?: string;
}
export class UpdateCardDto extends IntersectionType(CreateCardDto, AdditionalCard) { }
