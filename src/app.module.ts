import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { CommentModule } from './comments/comment.module';
import { Comment } from './comments/comment.model';
import { UserModule } from './users/user.module';
import { User } from './users/user.model';

import { AuthModule } from './auth/auth.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ProductModule } from './products/product.module';
import { Product } from './products/product.model'
import { Attraction } from './attractions/attraction.model';
import { AttractionModule } from './attractions/attraction.module'

import { Cart } from './carts/cart.model'
import { CartModule } from './carts/cart.module';

import { CartItem } from './cartItem/cartItem.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: true,
      port: config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      url: config.DB_URL,
      entities: [Comment, User, Product, Attraction, Cart, CartItem],
      synchronize: true,
    }),
    AuthModule.forRoot({
      connectionURI: config.SUPERTOKENS_CONNECTION_URL,
      apiKey: config.SUPERTOKENS_API_KEY,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/emailpassword/appinfo
        appName: 'salekhard',
        apiDomain: 'https://config.app_domain',
        websiteDomain: 'https://config.app_domain',
        apiBasePath: '/api',
        websiteBasePath: '/auth',
      },
    }),
    CommentModule,
    UserModule,
    WebsocketModule,
    ProductModule,
    AttractionModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
