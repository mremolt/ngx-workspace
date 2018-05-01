import { apiRequestEpic } from '@mr/ngx-tools';
import lolex from 'lolex';
import { schema } from 'normalizr';
import { AnyAction } from 'redux';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { throwError, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { IApiAction, IApiActionHandlers } from './../interfaces';
import { API_ACTION } from './../tokens';
import {} from 'rxjs/throw';
import { defaultDataProcessor, getHandlers, getUrl, normalizeData, getRequestPayload } from './api-request.epic';

describe('apiRequestEpic', () => {
  describe('getUrl', () => {
    const env: any = {
      apiUrl: 'http://www.example.com/api',
    };

    it('returns the original URL if absolute http', () => {
      const url = 'http://my.other.domain/api/users';
      expect(getUrl(url, env)).toEqual(url);
    });

    it('returns the original URL if absolute https', () => {
      const url = 'https://my.other.domain/api/users';
      expect(getUrl(url, env)).toEqual(url);
    });

    it('returns the original URL if absolute http(s)', () => {
      const url = '//my.other.domain/api/users';
      expect(getUrl(url, env)).toEqual(url);
    });

    it('prepends apiUrl if relative', () => {
      const url = '/users';
      expect(getUrl(url, env)).toEqual(`${env.apiUrl}/users`);
    });

    it('prepends apiUrl if relative', () => {
      const url = 'users';
      expect(getUrl(url, env)).toEqual(`${env.apiUrl}/users`);
    });
  });

  describe('getHandlers', () => {
    let subject: IApiActionHandlers;

    describe('if handlers is a string', () => {
      let clock: lolex.LolexClock<number>;

      beforeEach(() => {
        clock = lolex.install();
        subject = getHandlers('USER_FETCH', { value: 42 });
      });

      afterEach(() => {
        clock.uninstall();
      });

      describe('start', () => {
        it('returns the correct action', () => {
          expect(subject.start('hello')).toEqual({
            type: 'USER_FETCH_START',
            payload: 'hello',
            meta: { value: 42 },
          });
        });
      });

      describe('success', () => {
        it('returns the correct action', () => {
          const result = subject.success('hello');
          expect(result).toEqual({
            type: 'USER_FETCH_SUCCESS',
            payload: 'hello',
            meta: { value: 42, updatedAt: new Date() },
          });
        });
      });

      describe('error', () => {
        it('returns the correct action', () => {
          const error: any = new Error('ARGH');

          expect(subject.error(error)).toEqual({
            type: 'USER_FETCH_ERROR',
            payload: error,
            error: true,
            meta: { value: 42 },
          });
        });
      });

      describe('complete', () => {
        it('returns the correct action', () => {
          expect(subject.complete()).toEqual({
            type: 'USER_FETCH_COMPLETE',
            meta: { value: 42 },
          });
        });
      });
    });

    describe('if handlers is not a string', () => {
      it('just returns given handlers', () => {
        const handlers: any = { hello: 'TESTS' };
        expect(getHandlers(handlers)).toBe(handlers);
      });
    });
  });

  describe('defaultDataProcessor', () => {
    it('returns the original data', () => {
      expect(defaultDataProcessor(42)).toEqual(42);
    });
  });

  describe('normalizeData', () => {
    describe('if no schema is given', () => {
      it('returns the original data', () => {
        const data = { test: 'data' };
        const action: any = { payload: {} };
        expect(normalizeData(action, data)).toBe(data);
      });
    });

    describe('if a schema is given', () => {
      it('returns normalized data', () => {
        const data = { id: '42', name: 'Arthur' };
        const action: any = { payload: { normalizrSchema: new schema.Entity('users') } };

        expect(normalizeData(action, data)).toEqual({
          entities: { users: { 42: data } },
          result: '42',
        });
      });
    });
  });

  describe('getRequestPayload', () => {
    it('returns the normalized requestPayload', () => {
      const data = { id: '42', name: 'Arthur' };
      const action: any = {
        payload: {
          request: { options: { body: data } },
          normalizrSchema: new schema.Entity('users'),
        },
      };

      expect(getRequestPayload(action)).toEqual({
        entities: { users: { 42: data } },
        result: '42',
      });
    });
  });

  describe('apiRequestEpic', () => {
    const environment: any = {
      apiUrl: 'http://www.example.com/api',
    };
    const mockData = { id: '42', name: 'Arthur' };
    const action: IApiAction = {
      type: API_ACTION,
      payload: {
        request: {
          method: 'GET',
          url: 'users',
        },
        handlers: 'USERS_FETCH',
      },
    };

    let http: any;
    let actions$: Subject<IApiAction>;
    let subject: Observable<AnyAction>;
    let clock: lolex.LolexClock<number>;

    beforeEach(() => {
      clock = lolex.install();
      actions$ = new Subject();
      const mockRequest = jest.fn().mockImplementation(() => {
        return of(mockData);
      });
      http = { request: mockRequest };
      subject = apiRequestEpic(actions$, {} as any, { environment, http });
    });

    afterEach(() => {
      actions$.complete();
      clock.uninstall();
    });

    it('makes the http request', () => {
      subject.pipe(toArray()).subscribe(resultAction => {
        const [start, success, complete] = resultAction;

        expect(start).toEqual({ type: 'USERS_FETCH_START', payload: null, meta: {} });
        expect(success).toEqual({
          type: 'USERS_FETCH_SUCCESS',
          payload: { id: '42', name: 'Arthur' },
          meta: { updatedAt: new Date() },
        });
        expect(complete).toEqual({ type: 'USERS_FETCH_COMPLETE', meta: {} });
      });
      actions$.next(action);
    });

    it('calls the error cb on error', () => {
      const mockRequest = jest.fn().mockImplementation(() => {
        return throwError('NOOOOOOOOO');
      });
      http = { request: mockRequest };
      subject = apiRequestEpic(actions$, {} as any, { environment, http });

      subject.pipe(toArray()).subscribe(resultAction => {
        const [start, success, complete] = resultAction;

        expect(start).toEqual({ type: 'USERS_FETCH_START', payload: null, meta: {} });
        expect(success).toEqual({
          type: 'USERS_FETCH_ERROR',
          payload: 'NOOOOOOOOO',
          meta: {},
          error: true,
        });
        expect(complete).toEqual({ type: 'USERS_FETCH_COMPLETE', meta: {} });
      });

      actions$.next(action);
    });
  });
});
