import { InjectionToken } from '@angular/core';
import { IEnvironment } from './interfaces';
import { uuidMiddleware } from '@mr/redux-tools';

export const defaultSettings: IEnvironment = {
  production: false,
  apiUrl: '',
  throwOnSchemaError: false,
  autoUpdate: 'never',
  updateMessage: '',
  pageTitle: 'MR Default App',
  base: '/',
  additionalSettings: {},
  additionalMiddleware: [uuidMiddleware],
  additionalEnhancers: [],
};

export const APP_ENVIRONMENT = new InjectionToken<IEnvironment>('APP_ENVIRONMENT');
