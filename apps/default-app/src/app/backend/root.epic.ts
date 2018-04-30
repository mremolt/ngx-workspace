import { AnyAction } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';

export const pingEpic = (actions$: Observable<AnyAction>) => {
  return actions$.pipe(ofType('GREET_WORLD'), delay(500), mapTo({ type: 'GREET_UNIVERSE' }));
};

export const rootEpic = combineEpics(pingEpic);
