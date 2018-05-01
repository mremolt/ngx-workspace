import { AnyAction, Middleware } from 'redux';
export const setupMiddleware = (middleware: Middleware) => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };

  const next = jest.fn();
  const invoke = (action: AnyAction) => middleware(store)(next)(action);

  return { store, next, invoke };
};
