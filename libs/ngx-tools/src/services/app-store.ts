import { Inject, Injectable } from '@angular/core';
import { AnyAction, applyMiddleware, createStore, Reducer, Store, Unsubscribe } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { APP_ENVIRONMENT } from '../environment/default';
import { IEnvironment } from '../environment/interfaces';
import { HttpClient } from '@angular/common/http';
import { Selector } from 'reselect';
import { OperatorFunction, Observable, Subscriber } from 'rxjs';
import { distinctUntilChanged, share } from 'rxjs/operators';

export interface ISelectorMapping<S> {
  [key: string]: Selector<S, any>;
}

export type IProps = Readonly<{
  [key: string]: any;
}>;

@Injectable()
export class AppStore<S extends object = object> {
  public static instance: AppStore<any>;
  private _store: Store<S>;
  private setupComplete = false;

  constructor(@Inject(APP_ENVIRONMENT) private environment: IEnvironment, private http: HttpClient) {}

  protected get store(): Store<S> {
    if (!this.setupComplete) {
      throw new Error('Setup store first!');
    }
    return this._store;
  }

  public setup(rootReducer: Reducer<S>, rootEpic: Epic<AnyAction, S>, initialState: any = {}) {
    this._store = createStore(
      rootReducer,
      initialState,
      composeWithDevTools(
        applyMiddleware(
          createEpicMiddleware(rootEpic, { dependencies: { environment: this.environment, http: this.http } }),
          ...this.environment.additionalMiddleware
        ),
        // other store enhancers if any
        ...this.environment.additionalEnhancers
      )
    );
    this.setupComplete = true;
    AppStore.instance = this;
  }

  public dispatch<T extends AnyAction>(action: T): T {
    return this.store.dispatch(action);
  }

  public getState(): S {
    return this.store.getState();
  }

  public subscribe(listener: () => void): Unsubscribe {
    return this.store.subscribe(listener);
  }

  public select<R>(
    selector: Selector<S, R>,
    operators: OperatorFunction<any, R>[] = [],
    changeCallback?: (data: R) => void
  ): Observable<R> {
    return new Observable(subscriber => {
      let currentValue = selector(this.store.getState());
      subscriber.next(currentValue);

      const subscription = this.store.subscribe(() => {
        const nextValue = selector(this.store.getState());
        if (currentValue !== nextValue) {
          subscriber.next(nextValue);
          currentValue = nextValue;

          if (changeCallback) {
            changeCallback(nextValue);
          }
        }
      });

      subscriber.add(subscription);
    })
      .pipe(...operators)
      .pipe(distinctUntilChanged(), share());
  }

  public selectMulti(
    selectors: ISelectorMapping<S>,
    changeCallback?: (data: { [key: string]: any }) => void
  ): Observable<{ [key: string]: Readonly<any> }> {
    const keys = Object.keys(selectors);

    const processSelectors = (state: S, subscriber: Subscriber<any>): void => {
      const nextValue: IProps = keys.reduce((values, key) => {
        return { ...values, [key]: selectors[key](state) };
      }, {});

      subscriber.next(nextValue);

      if (changeCallback) {
        changeCallback(nextValue);
      }
    };

    return new Observable(subscriber => {
      processSelectors(this.store.getState(), subscriber);

      const subscription = this.store.subscribe(() => {
        processSelectors(this.store.getState(), subscriber);
      });

      subscriber.add(subscription);
    }).pipe(share() as any);
  }
}
