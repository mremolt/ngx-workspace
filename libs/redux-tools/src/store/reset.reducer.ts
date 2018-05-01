import { AnyAction, Reducer } from 'redux';

export const RESET_ACTION = '@@REDUX_UTILS/APP_RESET';

export function resetReducer(reducer: Reducer<any>): Reducer<any> {
  return (state: any, action: AnyAction) => {
    if (action.type === RESET_ACTION) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export function resetAction(): AnyAction {
  return { type: RESET_ACTION };
}
