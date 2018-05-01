import { AnyAction } from 'redux';
import { setupMiddleware } from './../utils/testing';
import { uuidMiddleware } from './uuid.middleware';

describe('uuidMiddleware', () => {
  let subject: AnyAction;

  beforeEach(() => {
    const { next, invoke } = setupMiddleware(uuidMiddleware);
    const action = { type: 'TEST', payload: 42 };
    invoke(action);
    subject = next.mock.calls[0][0];
  });

  it('leaves the type an payload as is', () => {
    expect(subject.type).toEqual('TEST');
    expect(subject.payload).toEqual(42);
  });

  it('adds an uuid to action meta', () => {
    expect(subject.meta.id).toMatch(
      /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i
    );
  });
});
