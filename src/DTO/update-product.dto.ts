import {
  IsString,
  IsOptional,
  IsNumberString,
  IsArray,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsNumberString()
  stock?: string;

  // Images to KEEP
  @IsOptional()
  @IsArray()
  existingImages?: string[];

  // New uploaded images
  @IsOptional()
  @IsArray()
  newImages?: string[];
}
