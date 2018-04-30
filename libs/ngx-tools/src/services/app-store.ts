import { Inject, Injectable } from '@angular/core';
import { AnyAction, applyMiddleware, createStore, Reducer, Store, Unsubscribe } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { APP_ENVIRONMENT } from '../environment/default';
import { IEnvironment } from '../environment/interfaces';

@Injectable()
export class AppStore<S = any> {
  public static instance: AppStore;
  private _store: Store<S>;
  private setupComplete = false;

  constructor(@Inject(APP_ENVIRONMENT) private env: IEnvironment) {}

  protected get store(): Store<S> {
    if (!this.setupComplete) {
      throw new Error('Setup store first!');
    }
    return this._store;
  }

  public setup(rootReducer: Reducer<S>, rootEpic: Epic<AnyAction, any>) {
    this._store = createStore(
      rootReducer,
      composeWithDevTools(
        applyMiddleware(createEpicMiddleware(rootEpic), ...this.env.additionalMiddleware),
        // other store enhancers if any
        ...this.env.additionalEnhancers
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
}
