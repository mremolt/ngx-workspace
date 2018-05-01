import { denormalize, Schema } from 'normalizr';
import { createSelector, OutputSelector } from 'reselect';
import { INormalizedEntityState, INormalizedState } from './interfaces';

export type Constructor<T = {}> = new (...args: any[]) => T;

export type ISubStateSelector<S, E extends INormalizedState = INormalizedEntityState> = (
  state: S
) => E;

export function subStateKeySelectorFactory<
  S,
  T,
  E extends INormalizedState = INormalizedEntityState
>(subStateSelector: ISubStateSelector<S, E>, key: keyof E): ((state: S) => T) {
  return (state: S) => (subStateSelector(state) as any)[key] as T;
}

export function rawEntitySelectorFactory<S, E>(
  subStateSelector: ISubStateSelector<S>,
  schema: Schema
): OutputSelector<S, E, (res: INormalizedEntityState) => E> {
  return createSelector([subStateSelector], subState => {
    return denormalize(subState.result, schema, subState.entities) as E;
  });
}

export function entitySelectorFactory<S, T>(
  rawSelector: any,
  entityConstructor: Constructor<T>
): OutputSelector<S, T, (res: any) => T> {
  return createSelector([rawSelector], rawEntity => new entityConstructor(rawEntity) as T);
}

export function normalizedEntitySelectorFactory<S, R, T>(
  subStateSelector: ISubStateSelector<S>,
  schema: Schema,
  entityConstructor: Constructor<T>
) {
  const rawSelector = rawEntitySelectorFactory<S, R>(subStateSelector, schema);
  return {
    subState: subStateSelector,
    loading: subStateKeySelectorFactory<S, boolean>(subStateSelector, 'loading'),
    loaded: subStateKeySelectorFactory<S, boolean>(subStateSelector, 'loaded'),
    updating: subStateKeySelectorFactory<S, boolean>(subStateSelector, 'updating'),
    error: subStateKeySelectorFactory<S, any>(subStateSelector, 'error'),
    updatedAt: subStateKeySelectorFactory<S, Date>(subStateSelector, 'updatedAt'),
    rawEntity: rawSelector,
    entity: entitySelectorFactory<S, T>(rawSelector, entityConstructor),
  };
}
