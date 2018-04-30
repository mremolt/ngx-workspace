import { AnyAction, combineReducers, Reducer } from 'redux';

const GREET_WORLD = 'GREET_WORLD';
const GREET_WHO = 'GREET_WHO';

const greet: Reducer<string> = (state: string = 'Unknown', action: AnyAction): string => {
  switch (action.type) {
    case GREET_WORLD:
      return 'World';

    case GREET_WHO:
      return action.payload;

    case 'GREET_UNIVERSE':
      return 'Universe';
  }

  return state;
};

export const rootReducer = combineReducers({ greet });
