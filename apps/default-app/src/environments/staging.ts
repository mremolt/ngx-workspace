import { defaultSettings, IEnvironment } from '@mr/ngx-tools';

export const settings: IEnvironment = {
  ...defaultSettings,
  production: true,
  apiUrl: '//localhost:3001',
  pageTitle: 'MR Default App (staging)',
};
