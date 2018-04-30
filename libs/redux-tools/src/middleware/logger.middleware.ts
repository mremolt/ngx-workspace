import { Action } from 'redux';
import { createLogger as distCreateLogger, ReduxLoggerOptions } from 'redux-logger';

export const diffPredicateBlacklist = (blacklist: string[]) => {
  return (_: Function, action: Action) => !blacklist.includes(action.type);
};

export const DEFAULT_OPTIONS = { collapsed: true, diff: true };

export const createLogger = (options: ReduxLoggerOptions = {}) => {
  options = { ...DEFAULT_OPTIONS, ...options };
  return distCreateLogger(options);
};

export const logger = createLogger();
