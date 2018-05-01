import { AnyAction } from 'redux';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { errorEpic } from './error.epic';

describe('errorEpic', () => {
  let actions$: Subject<AnyAction>;
  let subject: Observable<AnyAction>;

  beforeEach(() => {
    actions$ = new Subject();
    subject = errorEpic(actions$);
  });

  it('reacts to actions with the error property set to a truthy value', done => {
    subject.subscribe(() => {
      done();
    });

    actions$.next({ type: 'FOOOO', payload: {}, error: true });
  });

  it('does not react to actions with the error property set to a falsy value', () => {
    const mock = jest.fn();
    subject.subscribe(mock);

    actions$.next({ type: 'FOOOO', payload: {}, error: true });
    expect(mock).toHaveBeenCalled();

    mock.mockReset();
    expect(mock).not.toHaveBeenCalled();

    actions$.next({ type: 'FOOOO', payload: {}, error: false });
    actions$.next({ type: 'FOOOO', payload: {}, error: '' });
    actions$.next({ type: 'FOOOO', payload: {} });
    expect(mock).not.toHaveBeenCalled();
  });

  describe('error action', () => {
    it('returns an action with the correct format', done => {
      const errorAction = {
        type: 'FOOOO',
        payload: new Error('ARGH'),
        error: true,
        meta: { id: 42 },
      };

      subject.subscribe(action => {
        expect(action).toEqual({
          type: '@@NGX_UTILS/API_ERROR_ADD',
          payload: { error: errorAction.payload, id: 42, action: errorAction },
        });
        done();
      });

      actions$.next(errorAction);
    });

    it('leaves out the id if not delivered', done => {
      const errorAction = {
        type: 'FOOOO',
        payload: new Error('ARGH'),
        error: true,
      };

      subject.subscribe(action => {
        expect(action).toEqual({
          type: '@@NGX_UTILS/API_ERROR_ADD',
          payload: { error: errorAction.payload, id: undefined, action: errorAction },
        });
        done();
      });

      actions$.next(errorAction);
    });
  });
});
