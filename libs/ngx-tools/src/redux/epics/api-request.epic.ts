import { HttpClient } from '@angular/common/http';
import { generateAsyncActionNames } from '@mr/redux-tools';
import { normalize } from 'normalizr';
import { CurriedFunction2, curry } from 'ramda';
import { AnyAction } from 'redux';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { of, concat, never } from 'rxjs';
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators';
import { IEnvironment } from '../../environment/interfaces';
import { IApiAction, IApiActionHandlers } from '../interfaces';
import { API_ACTION } from '../tokens';

export { CurriedFunction2 };

export function getHandlers(handlers: IApiActionHandlers | string, meta?: object): IApiActionHandlers {
  if (typeof handlers === 'string') {
    const actions = generateAsyncActionNames(handlers);

    return {
      start(data) {
        return { type: actions.start, payload: data, meta: { ...meta } };
      },
      success(data) {
        return { type: actions.success, payload: data, meta: { ...meta, updatedAt: new Date() } };
      },
      error(error) {
        return { type: actions.error, payload: error, error: true, meta: { ...meta } };
      },
      complete() {
        return { type: actions.complete, meta: { ...meta } };
      },
    };
  } else {
    return handlers;
  }
}

export function getUrl(urlPath: string, environment: IEnvironment) {
  const urlRegex = /^(http(s)?|\/\/)/;

  if (urlPath.match(urlRegex)) {
    return urlPath;
  } else {
    return `${environment.apiUrl.replace(/\/$/, '')}/${urlPath.replace(/^\//, '')}`;
  }
}

export function defaultDataProcessor(data: any) {
  return data;
}

export function getRequestPayload(action: IApiAction): any {
  let requestPayload = action.payload.request.options ? action.payload.request.options.body : null;

  if (requestPayload && action.payload.normalizrSchema) {
    requestPayload = normalize(requestPayload, action.payload.normalizrSchema);
  }
  return requestPayload;
}

export const normalizeData = curry((action: IApiAction, data: any): any => {
  if (action.payload.normalizrSchema) {
    return normalize(data, action.payload.normalizrSchema);
  }
  return data;
});

export function apiRequestEpic<S>(
  action$: Observable<any>,
  _: S,
  dependencies: { http: HttpClient; environment: IEnvironment }
): Observable<AnyAction> {
  return action$.pipe(
    ofType(API_ACTION),
    mergeMap((action: IApiAction) => {
      const handlers: IApiActionHandlers = getHandlers(action.payload.handlers, action.meta);
      const request = action.payload.request;

      return concat(
        of(handlers.start(getRequestPayload(action))),
        dependencies.http
          .request(request.method, getUrl(request.url, dependencies.environment), request.options)
          .pipe(
            map(action.payload.rawDataProcessor || defaultDataProcessor),
            map(normalizeData(action)),
            map(handlers.success),
            catchError(error => of(handlers.error(error))),
            takeUntil(action.payload.cancel || never())
          ),
        of(handlers.complete())
      );
    })
  );
}
