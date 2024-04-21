import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsEmail } from 'class-validator';

export class CreateCommentBody {
  @ApiProperty({
    example: 'Sergey',
    description: 'The name of the commenter',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must only contain letters',
  })
  name: string;

  @ApiProperty({
    example: 'sergey@example.com',
    description: 'The email address of the commenter',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'Great attraction!',
    description: 'The content of the comment',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
