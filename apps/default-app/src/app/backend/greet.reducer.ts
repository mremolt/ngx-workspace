import { Reducer, AnyAction } from 'redux';
export const GREET_WORLD = 'GREET_WORLD';
export const GREET_WHO = 'GREET_WHO';

export const greet: Reducer<string> = (state: string = 'Unknown', action: AnyAction): string => {
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
