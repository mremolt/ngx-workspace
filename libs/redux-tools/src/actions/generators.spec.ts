import { generateAsyncActionNames } from './generators';

describe('generators', () => {
  describe('generateAsyncActionNames', () => {
    it('builds the correct output', () => {
      expect(generateAsyncActionNames('TEST_NAME')).toEqual({
        base: 'TEST_NAME',
        complete: 'TEST_NAME_COMPLETE',
        error: 'TEST_NAME_ERROR',
        reset: 'TEST_NAME_RESET',
        start: 'TEST_NAME_START',
        success: 'TEST_NAME_SUCCESS',
      });
    });
  });
});
