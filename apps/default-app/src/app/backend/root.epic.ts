import { AnyAction } from 'redux';
import { combineEpics, ofType, Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { delay, mapTo } from 'rxjs/operators';
import { IState } from './root.reducer';
import { apiRequestEpic, IEnvironment } from '@mr/ngx-tools';
import { HttpClient } from '@angular/common/http';

export interface IEpicDependencies {
  environment: IEnvironment;
  http: HttpClient;
}

export const pingEpic = (actions$: Observable<AnyAction>) => {
  return actions$.pipe(ofType('GREET_WORLD'), delay(500), mapTo({ type: 'GREET_UNIVERSE' }));
};

export const rootEpic: Epic<AnyAction, IState, IEpicDependencies> = combineEpics(pingEpic, apiRequestEpic);
