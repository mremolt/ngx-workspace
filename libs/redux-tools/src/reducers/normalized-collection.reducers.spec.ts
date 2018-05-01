import { Reducer } from 'redux';
import { INormalizedCollectionState } from './../selectors/interfaces';
import { generateAsyncActionNames } from '../actions/generators';
import {
  generateNormalizedState,
  pushIntoResult,
  updateEntity,
  addEntityToCollection,
  removeIdFromResult,
  asyncFetchStartReducer,
  asyncFetchSuccessReducer,
  asyncFetchErrorReducer,
  asyncFetchCompleteReducer,
  asyncFetchReducerFactory,
  asyncRemoveFromCollectionReducerFactory,
  normalizedCollectionReducerFactory,
} from './normalized-collection.reducers';

describe('reducers on normalized state', () => {
  describe('for a INormalizedCollectionState', () => {
    let initialState: INormalizedCollectionState;

    beforeAll(() => {
      initialState = Object.freeze({
        ...generateNormalizedState(),
        result: ['42', '43'],
        entities: {
          people: {
            42: { id: '42', firstname: 'Arthur', lastname: 'Dent' },
            43: { id: '43', firstname: 'Tricia', lastname: 'McMillan' },
          },
        },
      });
    });

    describe('updateEntity', () => {
      const addAction = {
        type: 'ANY',
        payload: {
          result: '44',
          entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
        },
      };
      let newState: INormalizedCollectionState;

      beforeEach(() => {
        newState = updateEntity('people', addAction)(initialState) as INormalizedCollectionState;
      });

      it('pushes action.payload into the right spot in entities key', () => {
        expect(newState.entities.people['44']).toEqual({
          id: '44',
          firstname: 'Ford',
          lastname: 'Perfect',
        });
      });

      it('leaves the existing keys in place', () => {
        expect(newState.entities.people['42']).toEqual({
          id: '42',
          firstname: 'Arthur',
          lastname: 'Dent',
        });
      });
    });

    describe('pushIntoResult', () => {
      const addAction = {
        type: 'ANY',
        payload: {
          result: '44',
          entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
        },
      };
      let newState: INormalizedCollectionState;

      beforeEach(() => {
        newState = pushIntoResult(initialState, addAction);
      });

      it('pushes the id into result', () => {
        expect(newState.result).toEqual(['42', '43', '44']);
      });

      it('removes all non unique keys', () => {
        newState = pushIntoResult(newState, addAction);
        expect(newState.result).toEqual(['42', '43', '44']);
      });
    });

    describe('addEntityToCollection', () => {
      const addAction = {
        type: 'ANY',
        payload: {
          result: '44',
          entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
        },
      };
      let newState: INormalizedCollectionState;

      beforeEach(() => {
        newState = addEntityToCollection('people', initialState, addAction);
      });

      it('pushes the id into result', () => {
        expect(newState.result).toEqual(['42', '43', '44']);
      });

      it('pushes action.payload into the right spot in entities key', () => {
        expect(newState.entities.people['44']).toEqual({
          id: '44',
          firstname: 'Ford',
          lastname: 'Perfect',
        });
      });
    });

    describe('removeIdFromResult', () => {
      const removeAction = {
        type: 'ANY',
        payload: {
          id: '42',
        },
      };
      let newResult: string[];

      beforeEach(() => {
        newResult = removeIdFromResult(initialState, removeAction) as any;
      });

      it('removes the id from result', () => {
        expect(newResult).toEqual(['43']);
      });
    });

    describe('asyncFetchStartReducer', () => {
      let newState: INormalizedCollectionState;

      beforeEach(() => {
        newState = asyncFetchStartReducer(initialState);
      });

      it('sets loading to true', () => {
        expect(newState.loading).toBe(true);
      });
    });

    describe('asyncFetchSuccessReducer', () => {
      let newState: INormalizedCollectionState;
      const successAction = {
        type: 'ANY',
        payload: {
          result: '44',
          entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
        },
        meta: { id: '12345' },
      };

      beforeEach(() => {
        newState = asyncFetchSuccessReducer(initialState, successAction);
      });

      it('sets loaded to true', () => {
        expect(newState.loaded).toBe(true);
      });

      it('sets result', () => {
        expect(newState.result).toEqual('44');
      });

      it('sets entities', () => {
        expect(newState.entities).toEqual(successAction.payload.entities);
      });
    });

    describe('asyncFetchErrorReducer', () => {
      const error = new Error('ARGH');
      let newState: INormalizedCollectionState;

      beforeEach(() => {
        newState = asyncFetchErrorReducer(initialState, { type: 'ARGH', payload: error });
      });

      it('sets error', () => {
        expect(newState.error).toBe(error);
      });
    });

    describe('asyncFetchCompleterReducer', () => {
      let newState: INormalizedCollectionState;

      it('keeps prev state if loading is false', () => {
        newState = asyncFetchCompleteReducer(initialState);
        expect(newState).toBe(initialState);
      });

      it('sets loading to false  if loading is true', () => {
        newState = asyncFetchCompleteReducer({ ...initialState, loading: true });
        expect(newState.loading).toBe(false);
      });
    });

    describe('asyncFetchReducerFactory', () => {
      const fetchActions = generateAsyncActionNames('FOO_FETCH');
      let subject: Reducer<INormalizedCollectionState>;
      let newState: INormalizedCollectionState;

      beforeAll(() => {
        subject = asyncFetchReducerFactory(initialState, fetchActions);
      });

      describe('startAction', () => {
        beforeEach(() => {
          newState = subject(initialState, { type: fetchActions.start });
        });

        it('sets loading to true', () => {
          expect(newState.loading).toBe(true);
        });
      });

      describe('successAction', () => {
        beforeEach(() => {
          newState = subject(initialState, {
            type: fetchActions.success,
            payload: {
              result: '44',
              entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
            },
          });
        });

        it('sets result', () => {
          expect(newState.result).toEqual('44');
        });

        it('sets entities', () => {
          expect(newState.entities).toEqual({
            people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } },
          });
        });
      });

      describe('errorAction', () => {
        beforeEach(() => {
          newState = subject(initialState, {
            type: fetchActions.error,
            payload: new Error('ARGH'),
          });
        });

        it('sets error', () => {
          expect(newState.error).toBeInstanceOf(Error);
        });
      });

      describe('completeAction', () => {
        beforeEach(() => {
          newState = subject(
            { ...initialState, loading: true },
            {
              type: fetchActions.complete,
            }
          );
        });

        it('sets loading to false', () => {
          expect(newState.loading).toBe(false);
        });
      });

      describe('resetAction', () => {
        beforeEach(() => {
          newState = subject(
            { ...initialState, loading: true, result: ['42'] },
            {
              type: fetchActions.reset,
            }
          );
        });

        it('returns initialState', () => {
          expect(newState).toBe(initialState);
        });
      });

      describe('any other action', () => {
        const prevState: any = { hello: 'Tests' };

        beforeEach(() => {
          newState = subject(prevState, {
            type: 'ANY',
          });
        });

        it('returns prev state', () => {
          expect(newState).toBe(prevState);
        });
      });
    });

    describe('asyncRemoveFromCollectionReducerFactory', () => {
      const removeActions = generateAsyncActionNames('FOO_REMOVE');
      let subject: Reducer<INormalizedCollectionState>;
      let newState: INormalizedCollectionState;

      beforeAll(() => {
        subject = asyncRemoveFromCollectionReducerFactory(removeActions);
      });

      describe('startAction', () => {
        beforeEach(() => {
          newState = subject(initialState, {
            type: removeActions.start,
            payload: {
              id: '43',
            },
          });
        });

        it('sets updating to true', () => {
          expect(newState.updating).toBe(true);
        });

        it('sets lastState to current state', () => {
          expect(newState.lastState).toBe(initialState);
        });

        it('removes id from result', () => {
          expect(newState.result).toEqual(['42']);
        });
      });

      describe('successAction', () => {
        let startState: INormalizedCollectionState;

        beforeAll(() => {
          startState = subject(initialState, {
            type: removeActions.start,
            payload: {
              id: '43',
            },
          });
        });

        beforeEach(() => {
          newState = subject(startState, {
            type: removeActions.success,
          });
        });

        it('sets updating to false', () => {
          expect(newState.updating).toBe(false);
        });

        it('resets lastState', () => {
          expect(newState.lastState).toBe(null);
        });

        it('keeps result', () => {
          expect(newState.result).toBe(startState.result);
        });
      });

      describe('errorAction', () => {
        const prevState = { ...initialState, lastState: { result: ['44', '45'] } as any };

        beforeEach(() => {
          newState = subject(prevState, {
            type: removeActions.error,
            payload: new Error('ARGH'),
          });
        });

        it('sets lastState to state', () => {
          expect(newState.result).toEqual(['44', '45']);
        });

        it('sets error', () => {
          expect(newState.error).toBeInstanceOf(Error);
        });

        it('resets lastState', () => {
          expect(newState.lastState).toBe(null);
        });
      });

      describe('any other action', () => {
        const prevState: any = { hello: 'Tests' };

        beforeEach(() => {
          newState = subject(prevState, {
            type: 'ANY',
          });
        });

        it('returns prev state', () => {
          expect(newState).toBe(prevState);
        });
      });
    });

    describe('normalizedCollectionReducerFactory', () => {
      const fetchActions = generateAsyncActionNames('FOO_FETCH');
      const createActions = generateAsyncActionNames('FOO_CREATE');
      const updateActions = generateAsyncActionNames('FOO_UPDATE');
      const removeActions = generateAsyncActionNames('FOO_REMOVE');
      let subject: Reducer<INormalizedCollectionState>;
      let newState: INormalizedCollectionState;

      beforeAll(() => {
        subject = normalizedCollectionReducerFactory(
          'people',
          initialState,
          fetchActions,
          createActions,
          updateActions,
          removeActions
        );
      });

      describe('updateActions.success', () => {
        const updateAction = {
          type: updateActions.success,
          payload: {
            result: '43',
            entities: { people: { 43: { id: '43', firstname: 'New', lastname: 'Name' } } },
          },
        };

        beforeEach(() => {
          newState = subject(initialState, updateAction);
        });

        it('replaces entity 43', () => {
          expect(newState.entities.people['43']).toEqual({
            id: '43',
            firstname: 'New',
            lastname: 'Name',
          });
        });
      });

      describe('createActions.success', () => {
        const updateAction = {
          type: createActions.success,
          payload: {
            result: '44',
            entities: { people: { 44: { id: '44', firstname: 'New', lastname: 'Name' } } },
          },
        };

        beforeEach(() => {
          newState = subject(initialState, updateAction);
        });

        it('adds entity 44', () => {
          expect(newState.entities.people['44']).toEqual({
            id: '44',
            firstname: 'New',
            lastname: 'Name',
          });
        });

        it('pushes id into result', () => {
          expect(newState.result).toEqual(['42', '43', '44']);
        });
      });

      describe('any other action', () => {
        const prevState: any = { hello: 'Tests' };

        beforeEach(() => {
          newState = subject(prevState, {
            type: 'ANY',
          });
        });

        it('returns prev state', () => {
          expect(newState).toBe(prevState);
        });
      });

      describe('initialState', () => {
        beforeEach(() => {
          newState = subject(undefined as any, {
            type: 'ANY',
          });
        });

        it('returns prev state', () => {
          expect(newState).toBe(initialState);
        });
      });
    });
  });
});
