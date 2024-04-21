import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.model';
import { CartItem } from '../cartItem/cartItem.model';
import { Product } from '../products/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    console.log(
      `Adding product ${productId} to cart for user ${userId} with quantity ${quantity}`,
    );

    let cart = await this.cartRepository.findOne({
      where: { userId: userId },
      relations: ['items', 'items.product'],
    });
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!cart) {
      cart = this.cartRepository.create({ userId, totalPrice: 0, items: [] });
    }

    if (!cart.items) {
      cart.items = [];
    }

    let cartItem = cart.items.find((item) => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    );

    await this.cartRepository.save(cart);

    return cart;
  }

  async recalculateCartTotal(cartId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new Error('Корзина не найдена');
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    );
    await this.cartRepository.save(cart);
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new Error('Корзина не найдена');
    }
    return cart;
  }

  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOneBy({
      id: cartItemId,
    });
    if (!cartItem) {
      throw new Error('Элемент корзины не найден');
    }
    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    return cartItem;
  }

  async removeCartItem(cartItemId: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) {
      throw new Error('Элемент корзины не найден');
    }

    await this.cartItemRepository.delete(cartItemId);
    
    await this.recalculateCartTotal(cartItem.cart.id);
  }

  async getCartById(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new Error('Корзина не найдена');
    }

    return cart;
  }
}
