import { Middleware, StoreEnhancer } from 'redux';

export type IAutoUpdateSettings = 'always' | 'confirm' | 'never';

export interface IEnvironment {
  production: boolean;
  apiUrl: string;
  apiVersion?: string;
  throwOnSchemaError: boolean;
  autoUpdate: IAutoUpdateSettings;
  updateMessage: string;
  pageTitle: string;
  base: string;
  additionalSettings: object;
  additionalMiddleware: Middleware[];
  additionalEnhancers: StoreEnhancer[];
}
