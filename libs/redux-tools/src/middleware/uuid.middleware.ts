import { Middleware } from 'redux';

// rollup vs. typescript
const uuid = require('uuid/v4');

export const uuidMiddleware: Middleware = _ => next => (action: any) => {
  // add unique id if not already manually set by user
  if (!(action.meta && action.meta.id)) {
    action = { ...action, meta: { ...action.meta, id: uuid() } };
  }
  return next(action);
};
