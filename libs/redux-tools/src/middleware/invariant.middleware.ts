import { HttpErrorResponse } from '@angular/common/http';

// broken typings, so old require
const immutableStateInvariantMiddleware: any = require('redux-immutable-state-invariant').default;
// missing typings, so old require
const isPrimitive: any = require('is-primitive');

const isImmutable = (value: any) => {
  // HttpErrorResponse is a circular structure, redux-immutable-state-invariant chokes and dies on those
  return isPrimitive(value) || value instanceof HttpErrorResponse;
};

const immutableStateInvariantSettings: any = {
  ignore: ['error', '_persist'],
  isImmutable,
};

export const invariantMiddleware = immutableStateInvariantMiddleware(immutableStateInvariantSettings);
