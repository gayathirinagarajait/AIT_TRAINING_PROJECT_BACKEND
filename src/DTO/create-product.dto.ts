import {
  IsString,
  IsNumberString,
 
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string | undefined;

  @IsNumberString()
  price: string | undefined;

  @IsNumberString()
  stock: string | undefined;

 
}
