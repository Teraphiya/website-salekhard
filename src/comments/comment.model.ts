import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, Matches, IsEmail } from 'class-validator';

@Entity()
export class Comment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must only contain letters',
  })
  name: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  content: string;
}
