import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateProductBody {
  @ApiProperty({
    example: 'Awesome Product',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must only contain letters',
  })
  name: string;

  @ApiProperty({
    example: 'Detailed description of the product.',
    description: 'The description of the product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 299, description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  @Max(10000, { message: 'Price must be less than 10000' })
  price: number;

  @ApiProperty({
    example: '/images/product.jpg',
    description: 'The image path of the product',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\/images\/.*\.(jpg|jpeg|png|gif)$/, {
    message: 'Image must be a path to an image file (jpg, jpeg, png, gif)',
  })
  image: string;
}
