import { InjectionToken } from '@angular/core';
import { IEnvironment } from './interfaces';

export const defaultSettings: IEnvironment = {
  production: false,
  apiUrl: '',
  throwOnSchemaError: false,
  autoUpdate: 'never',
  updateMessage: '',
  pageTitle: 'MR Default App',
  base: '/',
  additionalSettings: {},
  additionalMiddleware: [],
  additionalEnhancers: [],
};

export const APP_ENVIRONMENT = new InjectionToken<IEnvironment>('APP_ENVIRONMENT');
