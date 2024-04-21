import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { CommentService } from './comments/comment.service';
import { SessionContainer } from 'supertokens-node/recipe/session';
import supertokens from 'supertokens-node';

import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session/session.decorator';
import { ProductService } from './products/product.service';
import { AttractionService } from './attractions/attraction.service';

const testLogin = false;

@Controller()
export class AppController {
  constructor(
    private readonly commentService: CommentService,
    private readonly productService: ProductService,
    private readonly attractionService: AttractionService,
  ) {}

  @Get()
  @UseGuards(new AuthGuard())
  @Render('index')
  async getIndex(@Session() session: SessionContainer) {
    if (session) {
      const userId = session.getUserId();
      const userInfo = await supertokens.getUser(userId);
      return {
        headerText: 'Салехард',
        title: 'Город Салехард',
        isIndex: true,
        mail: userInfo.emails[0],
      };
    }
    return {
      headerText: 'Добро пожаловать в Салехард!',
      title: 'Город Салехард',
      isIndex: true,
    };
  }

  @Get('photos')
  @UseGuards(new AuthGuard())
  @Render('photos')
  async getProfile(@Session() session: SessionContainer) {
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    const comments = isLoggedIn
      ? (await this.commentService.searchMany()).reverse()
      : [];
    return {
      headerText: 'Фотографии Салехарда',
      title: 'Фотографии Салехарда',
      isPhotos: true,
      isLoggedIn,
      mail,
      comments,
    };
  }

  @Get('map')
  @UseGuards(new AuthGuard())
  @Render('map')
  async getMap(@Session() session: SessionContainer) {
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Селехард на карте',
      title: 'Интерактивная карта Салехарда',
      isMap: true,
      isLoggedIn,
      mail,
    };
  }

  @Get('weather')
  @UseGuards(new AuthGuard())
  @Render('weather')
  async getWeather(@Session() session: SessionContainer) {
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Погода в Салехарде',
      title: 'Погода в Салехарде',
      isWeather: true,
      isLoggedIn,
      mail,
    };
  }

  @Get('planer')
  @UseGuards(new AuthGuard())
  @Render('planer')
  async getPlaner(@Session() session: SessionContainer) {
    const attractions = await this.attractionService.searchMany();
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Планировщик',
      title: 'Планировщик посещений - Салехард',
      isPlaner: true,
      attractions,
      mail,
      isLoggedIn,
    };
  }

  @Get('shop')
  @UseGuards(new AuthGuard())
  @Render('shop')
  async getShop(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 9,
    @Session() session: SessionContainer,
  ) {
    const [products, total] = await this.productService.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Магазин',
      title: 'Магазин сувениров и не только',
      isShop: true,
      products,
      page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      isLoggedIn,
      mail,
    };
  }

  @Get('profileuser')
  @UseGuards(new AuthGuard())
  @Render('profileuser')
  async getProfileuser(@Session() session: SessionContainer) {
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Личный кабинет',
      title: 'Ваш личный кабинет',
      isProfileuser: true,
      isLoggedIn,
      mail,
    };
  }

  @Get('cart')
  @UseGuards(new AuthGuard())
  @Render('cart')
  async getCart(@Session() session: SessionContainer) {
    const isLoggedIn = !!session;
    const mail = isLoggedIn
      ? (await supertokens.getUser(session.getUserId())).emails[0]
      : null;
    return {
      headerText: 'Корзина',
      title: 'Ваша корзина',
      isCart: true,
      isLoggedIn,
      mail,
    };
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return {
      headerText: 'Вход в личный кабинет',
      title: 'Вход на сайт',
      isLogin: true,
      isLoggedIn: testLogin,
    };
  }

  @Get('register')
  @Render('register')
  getReg() {
    return {
      headerText: 'Регистрация',
      title: 'Регистрация',
      isRegister: true,
      isLoggedIn: testLogin,
    };
  }
}
