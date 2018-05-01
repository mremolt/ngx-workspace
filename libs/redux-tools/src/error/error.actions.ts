import { AnyAction } from 'redux';
import { ERROR_ACTION } from '../constants';

export const ERROR_ACTION_ADD = `${ERROR_ACTION}_ADD`;
export const ERROR_ACTION_RESET = `${ERROR_ACTION}_RESET`;

export function addError(error: any, id?: string, action?: AnyAction) {
  return {
    type: ERROR_ACTION_ADD,
    payload: {
      error,
      id,
      action,
    },
  };
}

export function resetErrors() {
  return {
    type: ERROR_ACTION_RESET,
  };
}
