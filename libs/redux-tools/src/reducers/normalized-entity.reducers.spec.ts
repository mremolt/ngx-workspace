import { Reducer } from 'redux';
import { INormalizedEntityState } from './../selectors/interfaces';
import { generateNormalizedState } from './normalized-collection.reducers';
import { generateAsyncActionNames } from '../actions/generators';
import {
  asyncSaveEntityReducerFactory,
  asyncRemoveEntityReducerFactory,
  normalizedEntityReducerFactory,
} from './normalized-entity.reducers';

describe('reducers on INormalizedEntityState', () => {
  let initialState: INormalizedEntityState;

  beforeAll(() => {
    initialState = Object.freeze({
      ...generateNormalizedState(),
      result: '42',
      entities: {
        people: {
          42: { id: '42', firstname: 'Arthur', lastname: 'Dent' },
          43: { id: '43', firstname: 'Tricia', lastname: 'McMillan' },
        },
      },
    });
  });

  describe('asyncSaveEntityReducerFactory', () => {
    const updateActions = generateAsyncActionNames('FOO_UPDATE');
    let subject: Reducer<INormalizedEntityState>;
    let newState: INormalizedEntityState;

    beforeAll(() => {
      subject = asyncSaveEntityReducerFactory(initialState, updateActions);
    });

    describe('startAction', () => {
      beforeEach(() => {
        newState = subject(initialState, {
          type: updateActions.start,
          payload: {
            result: '44',
            entities: { people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } } },
          },
        });
      });

      it('sets updating to true', () => {
        expect(newState.updating).toBe(true);
      });

      it('sets lastState to current state', () => {
        expect(newState.lastState).toBe(initialState);
      });

      it('sets result from payload', () => {
        expect(newState.result).toEqual('44');
      });

      it('sets entities from payload', () => {
        expect(newState.entities).toEqual({
          people: { 44: { id: '44', firstname: 'Ford', lastname: 'Perfect' } },
        });
      });

      describe('if a lastState is already present', () => {
        beforeEach(() => {
          newState = subject(newState, {
            type: updateActions.start,
            payload: {
              result: '42',
              entities: { people: { 42: { id: '42', firstname: 'Ford', lastname: 'Perfect' } } },
            },
          });
        });

        it('removes lastState inside lastState', () => {
          expect((newState.lastState as any).lastState).toBe(null);
        });
      });
    });

    describe('successAction', () => {
      const prevState = { ...initialState, lastState: { result: 'TESTS' } as any };

      beforeEach(() => {
        newState = subject(prevState, {
          type: updateActions.success,
          payload: {
            result: '45',
            entities: { people: { 45: { id: '45', firstname: 'Ford', lastname: 'Perfect' } } },
          },
        });
      });

      it('sets loaded to true', () => {
        expect(newState.loaded).toBe(true);
      });

      it('resets lastState', () => {
        expect(newState.lastState).toBe(null);
      });

      it('sets result from payload', () => {
        expect(newState.result).toBe('45');
      });

      it('sets entities from payload', () => {
        expect(newState.entities).toEqual({
          people: { 45: { id: '45', firstname: 'Ford', lastname: 'Perfect' } },
        });
      });
    });

    describe('errorAction', () => {
      const prevState: INormalizedEntityState = {
        ...initialState,
        lastState: { result: 'TESTS' } as any,
        error: null,
      };

      beforeEach(() => {
        newState = subject(prevState, {
          type: updateActions.error,
          payload: new Error('ARGH'),
        });
      });

      it('sets lastState to state', () => {
        expect(newState.result).toEqual('TESTS');
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

  describe('asyncRemoveEntityReducerFactory', () => {
    const removeActions = generateAsyncActionNames('FOO_REMOVE');
    let subject: Reducer<INormalizedEntityState>;
    let newState: INormalizedEntityState;

    beforeAll(() => {
      subject = asyncRemoveEntityReducerFactory(initialState, removeActions);
    });

    describe('startAction', () => {
      let prevState: INormalizedEntityState;

      beforeEach(() => {
        prevState = { ...initialState, result: 'test' };
        newState = subject(prevState, {
          type: removeActions.start,
        });
      });

      it('sets lastState to current state', () => {
        expect(newState.lastState).toBe(prevState);
      });

      it('resets the rest to initialState', () => {
        expect(newState.result).toBe(initialState.result);
      });

      it('sets updating', () => {
        expect(newState.updating).toBeTruthy();
      });
    });

    describe('successAction', () => {
      let prevState: INormalizedEntityState;

      beforeEach(() => {
        prevState = { ...initialState, updating: true, lastState: { test: 'data' } as any };
        newState = subject(prevState, {
          type: removeActions.success,
        });
      });

      it('resets lastState ', () => {
        expect(newState.lastState).toBeNull();
      });

      it('sets updating', () => {
        expect(newState.updating).toBeFalsy();
      });
    });

    describe('errorAction', () => {
      let prevState: INormalizedEntityState;
      const payload = new Error('ARGH');

      beforeEach(() => {
        prevState = { ...initialState, updating: true, lastState: { test: 'data' } as any };
        newState = subject(prevState, {
          type: removeActions.error,
          payload,
        });
      });

      it('resets lastState ', () => {
        expect(newState.lastState).toBeNull();
      });

      it('sets updating', () => {
        expect(newState.updating).toBeFalsy();
      });

      it('sets error', () => {
        expect(newState.error).toBe(payload);
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

  describe('normalizedEntityReducerFactory', () => {
    const fetchActions = generateAsyncActionNames('FOO_FETCH');
    const createActions = generateAsyncActionNames('FOO_CREATE');
    const updateActions = generateAsyncActionNames('FOO_UPDATE');
    const removeActions = generateAsyncActionNames('FOO_REMOVE');
    let initialEntityState: INormalizedEntityState;
    let subject: Reducer<INormalizedEntityState>;
    let newState: INormalizedEntityState;

    beforeAll(() => {
      initialEntityState = { ...initialState, result: '42' };

      subject = normalizedEntityReducerFactory(
        initialEntityState,
        fetchActions,
        createActions,
        updateActions,
        removeActions
      );
    });

    describe('with no prev state', () => {
      beforeEach(() => {
        newState = subject(undefined as any, {
          type: 'ANY',
        });
      });

      it('returns initialState', () => {
        expect(newState).toBe(initialEntityState);
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

    describe('normalized actions', () => {
      beforeEach(() => {
        newState = subject(initialEntityState, { type: fetchActions.start });
      });

      it('wraps the other normalized reducers (fetch loading as anb example)', () => {
        expect(newState.loading).toBe(true);
      });
    });
  });
});
