import { AnyAction } from 'redux';

import { ERROR_ACTION_ADD, ERROR_ACTION_RESET } from './error.actions';

export interface IErrorItem {
  id: string | null;
  value: any;
  action: AnyAction;
}

export interface IErrorState {
  latest: IErrorItem | null;
  errors: IErrorItem[];
}

export const initialState: IErrorState = {
  latest: null,
  errors: [],
};

export function error(state: IErrorState = initialState, action: AnyAction): IErrorState {
  switch (action.type) {
    case ERROR_ACTION_ADD:
      return { latest: action.payload, errors: [...state.errors, action.payload] };

    case ERROR_ACTION_RESET:
      return initialState;
  }

  return state;
}
