import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreatCartBody } from './cart.types';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully added to cart.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async addToCart(@Body() body: CreatCartBody) {
    try {
      return await this.cartService.addToCart(
        body.userId,
        body.productId,
        body.quantity,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get cart by user ID' })
  @ApiResponse({ status: 200, description: 'Cart found.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({
    name: 'userId',
    required: true,
    type: Number,
    description: 'User ID',
  })
  async getCart(@Param('userId') userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  @Get('by-id/:cartId')
  @ApiOperation({ summary: 'Get cart by cart ID' })
  @ApiResponse({ status: 200, description: 'Cart found.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({
    name: 'cartId',
    required: true,
    type: Number,
    description: 'Cart ID',
  })
  async getCartById(@Param('cartId') cartId: number) {
    return await this.cartService.getCartById(cartId);
  }

  @Put('/item/:cartItemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Quantity updated.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  @ApiParam({
    name: 'cartItemId',
    required: true,
    type: Number,
    description: 'Cart Item ID',
  })
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body('quantity') quantity: number,
  ) {
    try {
      return await this.cartService.updateCartItemQuantity(
        cartItemId,
        quantity,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/item/:cartItemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiParam({
    name: 'cartItemId',
    required: true,
    type: Number,
    description: 'Cart Item ID',
  })
  async removeCartItem(@Param('cartItemId') cartItemId: number) {
    try {
      await this.cartService.removeCartItem(cartItemId);
      return { message: 'Item removed successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
