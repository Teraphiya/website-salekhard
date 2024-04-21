import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';

import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'firstName',
                validate: async (value) => {
                  if (typeof value !== 'string' || value.trim().length === 0) {
                    return 'Имя обязательно к заполнению';
                  }
                  return undefined;
                },
              },
              {
                id: 'lastName',
                validate: async (value) => {
                  if (typeof value !== 'string' || value.trim().length === 0) {
                    return 'Фамилия обязательна к заполнению';
                  }
                  return undefined;
                },
              },
              {
                id: 'patronymic',
                optional: true,
                validate: async (value) => {
                  if (value !== undefined && typeof value !== 'string') {
                    return 'Отчество должно быть строкой';
                  }
                  return undefined;
                },
              },
              {
                id: 'gender',
                validate: async (value) => {
                  if (
                    typeof value !== 'string' ||
                    (value !== 'male' && value !== 'female')
                  ) {
                    return 'Укажите корректный пол';
                  }
                  return undefined;
                },
              },
              {
                id: 'phone',
                validate: async (value) => {
                  if (typeof value !== 'string' || value.trim().length === 0) {
                    return 'Номер телефона обязателен к заполнению';
                  }
                  return undefined;
                },
              },
            ],
          },
        }),
        Session.init({
          exposeAccessTokenToFrontendInCookieBasedAuth: true,
        }),
        Dashboard.init(),
        UserRoles.init(),
      ],
    });
  }
}
