import { defaultSettings, IEnvironment } from '@mr/ngx-tools';
import { createLogger, diffPredicateBlacklist, invariantMiddleware } from '@mr/redux-tools';

export const settings: IEnvironment = {
  ...defaultSettings,

  apiUrl: '//localhost:3001',
  pageTitle: 'MR Default App (development)',
  additionalMiddleware: [invariantMiddleware, createLogger({ diffPredicate: diffPredicateBlacklist(['GREET_WHO']) })],
};
