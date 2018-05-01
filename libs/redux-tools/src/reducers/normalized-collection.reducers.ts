import { AnyAction } from 'redux';
import { IAsyncActionNames } from '../actions/generators';
import { INormalizedCollectionState, INormalizedState } from '../selectors/interfaces';
import {
  __,
  compose,
  curry,
  equals,
  lensPath,
  reject,
  set,
  uniq,
  view,
  mergeDeepRight,
  CurriedFunction2,
  CurriedFunction3,
} from 'ramda';

// ARGH Typescript
export { CurriedFunction2, CurriedFunction3 };

export const generateNormalizedState = (): INormalizedState => {
  return {
    entities: {},
    loading: false,
    loaded: false,
    updating: false,
    updatedAt: null,
    error: null,
    lastState: null,
  };
};

export const updateEntity = curry((key: string, action: AnyAction) => {
  const entityLens = lensPath(['entities', key, action.payload.result]);
  return set(entityLens, view(entityLens, action.payload));
});

export const pushIntoResult = curry(
  (state: INormalizedCollectionState, action: AnyAction): INormalizedCollectionState => {
    return { ...state, result: uniq([...state.result, action.payload.result]) };
  }
);

export const removeIdFromResult = (state: INormalizedCollectionState, action: AnyAction) =>
  reject(equals(String(action.payload.id)), state.result);

export const addEntityToCollection = curry(
  (key: string, state: INormalizedCollectionState, action: AnyAction) =>
    compose(updateEntity(key, action), pushIntoResult(__, action))(state) as INormalizedCollectionState
);

export function asyncFetchStartReducer<S extends INormalizedState>(state: S): S {
  return Object.assign({}, state, { loading: true });
}

export function asyncFetchSuccessReducer<S extends INormalizedState>(state: S, action: AnyAction): S {
  return Object.assign({}, state, action.payload, {
    loaded: true,
    updatedAt: action.meta && action.meta.updatedAt,
  });
}

export function asyncFetchErrorReducer<S extends INormalizedState>(state: S, action: AnyAction): S {
  return Object.assign({}, state, { error: action.payload });
}

export function asyncFetchCompleteReducer<S extends INormalizedState>(state: S): S {
  return state.loading ? Object.assign({}, state, { loading: false }) : state;
}

export function asyncFetchReducerFactory<S extends INormalizedState>(
  initialState: S,
  actionHandlers: IAsyncActionNames
) {
  return curry((state: S, action: AnyAction): S => {
    switch (action.type) {
      case actionHandlers.start:
        return asyncFetchStartReducer(initialState);

      case actionHandlers.success:
        return asyncFetchSuccessReducer(initialState, action);

      case actionHandlers.error:
        return asyncFetchErrorReducer(initialState, action);

      case actionHandlers.complete:
        return asyncFetchCompleteReducer(state);

      case actionHandlers.reset:
        return initialState;
    }

    return state;
  });
}

export function asyncRemoveFromCollectionReducerFactory<S extends INormalizedCollectionState>(
  actionHandlers: IAsyncActionNames
) {
  return curry((state: S, action: AnyAction): S => {
    switch (action.type) {
      case actionHandlers.start:
        return Object.assign({}, state, {
          result: removeIdFromResult(state, action),
          updating: true,
          lastState: state,
        });

      case actionHandlers.success:
        return Object.assign({}, state, { lastState: null, updating: false });

      case actionHandlers.error:
        return Object.assign({}, state.lastState as S, {
          error: action.payload,
          updating: false,
          lastState: null,
        });
    }

    return state;
  });
}

export function normalizedCollectionReducerFactory<S extends INormalizedCollectionState>(
  key: string,
  initialState: S,
  fetchActions: IAsyncActionNames,
  createActions: IAsyncActionNames,
  updateActions: IAsyncActionNames,
  deleteActions: IAsyncActionNames
) {
  const fetchReducer = asyncFetchReducerFactory(initialState, fetchActions);
  const removeFromCollectionReducer = asyncRemoveFromCollectionReducerFactory(deleteActions);

  return (state: S = initialState, action: AnyAction): S => {
    state = fetchReducer(state, action);
    state = removeFromCollectionReducer(state, action) as S;

    switch (action.type) {
      case updateActions.success:
        return mergeDeepRight(state, { entities: action.payload.entities }) as S;

      case createActions.success:
        return addEntityToCollection(key, state, action) as S;
    }

    return state;
  };
}
