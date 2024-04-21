import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.APP_DOMAIN,
      'http://localhost:3000',
      'https://salekhard.onrender.com',
    ],
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('addToCart')
  handleAddToCart(
    client: any,
    product: { productId: string; quantity: number },
  ): void {
    this.server.emit('productAdded', {
      productId: product.productId,
      quantity: product.quantity,
    });
  }

  @SubscribeMessage('removeFromCart')
  handleRemoveFromCart(client: any, data: { cartItemId: number }): void {
    this.server.emit('productRemoved', {
      cartItemId: data.cartItemId,
    });
  }

  broadcastNewProduct(product: any) {
    this.server.emit('newProduct', product);
  }
}
