import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Sergey',
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must only contain letters',
  })
  firstName: string;

  @ApiProperty({
    example: 'Nilogov',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'LastName must only contain letters',
  })
  lastName: string;

  @ApiProperty({
    example: 'Aleksandrovich',
    description: 'The patronymic name of the user (optional)',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Patronymic must only contain letters',
  })
  patronymic?: string;

  @ApiProperty({
    example: 'male',
    description: 'The gender of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['male', 'female'], { message: 'Gender must be either male or female' })
  gender: string;

  @ApiProperty({
    example: '+79220763378',
    description: 'The phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+7\d{10}$/, {
    message:
      'Phone must be a valid Russian phone number starting with +7 followed by 10 digits',
  })
  phone: string;

  @ApiProperty({
    example: 'sergey@example.com',
    description: 'The email address of the user',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
