import { AnyAction } from 'redux';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ERROR_ACTION_ADD } from './error.actions';

export function errorEpic(action$: Observable<AnyAction>): Observable<AnyAction> {
  return action$.pipe(
    filter(action => action.error),
    map(action => {
      return {
        type: ERROR_ACTION_ADD,
        payload: { error: action.payload, id: action.meta && action.meta.id, action },
      };
    })
  );
}
