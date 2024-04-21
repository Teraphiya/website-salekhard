    import { ApiProperty } from '@nestjs/swagger';
    import { IsNumber, Min } from 'class-validator';

    export class UpdateCartItemDto {
    @ApiProperty({
        example: 1,
        description: 'Новое количество товара',
    })
    @IsNumber()
    @Min(1)
    quantity: number;
    }
