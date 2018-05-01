import { InjectionToken } from '@angular/core';

export interface ITranslationConfig {
  name: string;
  translations: any;
}

export const APP_TRANSLATIONS: InjectionToken<ITranslationConfig> = new InjectionToken(
  'APP_TRANSLATIONS'
);
