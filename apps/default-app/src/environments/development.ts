import { defaultSettings, IEnvironment } from '@mr/ngx-tools';
import { createLogger, diffPredicateBlacklist, invariantMiddleware } from '@mr/redux-tools';

export const settings: IEnvironment = {
  ...defaultSettings,

  apiUrl: '//jsonplaceholder.typicode.com',
  pageTitle: 'MR Default App (development)',
  additionalMiddleware: [
    ...defaultSettings.additionalMiddleware,
    invariantMiddleware,
    createLogger({ diffPredicate: diffPredicateBlacklist(['GREET_WHO']) }),
  ],
};
