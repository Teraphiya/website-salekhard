import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateAttractionBody {
  @ApiProperty({
    example: 'Name of the Attraction',
    description: 'The name of the attraction',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Location of the Attraction',
    description: 'The location of the attraction',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 1990,
    description: 'The year the attraction was founded',
  })
  @IsInt()
  @Min(1500, { message: 'Foundation year must be a positive integer' })
  @Max(2024, { message: 'Must be 2024' })
  foundationYear: number;

  @ApiProperty({
    example: 'Description of the Attraction',
    description: 'The description of the attraction',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '/images/attraction.jpg',
    description: 'The image path of the attraction',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\/images\/.*\.(jpg|jpeg|png|gif)$/, {
    message: 'Image must be a path to an image file (jpg, jpeg, png, gif)',
  })
  image: string;
}
