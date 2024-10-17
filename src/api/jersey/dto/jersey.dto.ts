import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDecimal,
  IsInt,
  IsNumber,
} from 'class-validator';

export class JerseyDTO {
  @IsNotEmpty()
  @IsString()
  jerseyTitle: string;

  @IsString()
  jerseyDescription: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  teamId: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  size: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  cost: number;
}
