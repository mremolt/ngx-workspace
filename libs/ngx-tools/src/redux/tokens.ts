import { InjectionToken } from '@angular/core';

export const REDUX_MIDDLEWARE_TOKEN: InjectionToken<string> = new InjectionToken(
  'REDUX_MIDDLEWARE_TOKEN'
);
export const API_ACTION = '@@NGX_TOOLS/API_REQUEST';
