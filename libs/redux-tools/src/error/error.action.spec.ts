import { addError, resetErrors } from './error.actions';

describe('error actions', () => {
  describe('addError', () => {
    it('creates the correct action', () => {
      const error = new Error('ARGH');
      const id = 'the-id';
      const action = { type: 'I_FAILED', payload: 'MISERABLY' };

      expect(addError(error, id, action)).toEqual({
        type: '@@NGX_UTILS/API_ERROR_ADD',
        payload: { error, id, action },
      });
    });
  });

  describe('resetErrors', () => {
    it('creates the correct action', () => {
      expect(resetErrors()).toEqual({ type: '@@NGX_UTILS/API_ERROR_RESET' });
    });
  });
});
