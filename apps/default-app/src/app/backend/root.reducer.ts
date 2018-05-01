import { combineReducers, Reducer } from 'redux';
import storage from 'localforage';
import { resetReducer } from '@mr/redux-tools';
import { persistReducer } from 'redux-persist';
import { greet } from './greet.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

export type IState = Readonly<{
  greet: string;
}>;

export const rootReducer: Reducer<IState> = persistReducer(
  persistConfig,
  resetReducer(
    combineReducers({
      greet,
    })
  )
);
