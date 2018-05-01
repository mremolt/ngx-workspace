import { ERROR_ACTION_ADD, ERROR_ACTION_RESET } from './error.actions';
import { error, initialState } from './error.reducer';

describe('error reducer', () => {
  describe('ERROR_ACTION_ADD', () => {
    it('returns the correct initialState', () => {
      expect(error(undefined, { type: 'ANY' })).toEqual(initialState);
    });

    it('sets the current error to latest', () => {
      const err = new Error('ARGH');
      expect(error(initialState, { type: ERROR_ACTION_ADD, payload: err }).latest).toEqual(err);
    });

    it('adds the current error to errors', () => {
      const err = new Error('ARGH');
      expect(error(initialState, { type: ERROR_ACTION_ADD, payload: err }).errors).toEqual([err]);
    });

    it('replaces latest and adds the current error to errors on second invocation', () => {
      const err1 = new Error('ARGH');
      const err2 = new Error('NOOOOOO');

      const state = error(initialState, { type: ERROR_ACTION_ADD, payload: err1 });

      expect(error(state, { type: ERROR_ACTION_ADD, payload: err2 })).toEqual({
        latest: err2,
        errors: [err1, err2],
      });
    });
  });

  describe('ERROR_ACTION_RESET', () => {
    it('resets the state to initial state', () => {
      expect(
        error({ latest: new Error(), errors: [] } as any, { type: ERROR_ACTION_RESET })
      ).toEqual(initialState);
    });
  });
});
