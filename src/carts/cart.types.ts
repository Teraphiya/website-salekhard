import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreatCartBody {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
  })
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the product to add to the cart',
  })
  @IsNotEmpty({ message: 'Product ID must not be empty' })
  @IsNumber({}, { message: 'Product ID must be a number' })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  @IsNotEmpty({ message: 'Quantity must not be empty' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
