import { ChangeDetectorRef } from '@angular/core';
import { AppStore } from '@mr/ngx-tools';
import { AnyAction } from 'redux';
import { Selector } from 'reselect';
import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, share } from 'rxjs/operators';
import { ContainerComponent } from './container-component.class';

export class StoreComponent<S extends object = any> extends ContainerComponent {
  constructor(protected store: AppStore<S>, protected cd: ChangeDetectorRef) {
    super();
  }

  public dispatch<T extends AnyAction>(action: T): T {
    return this.store.dispatch(action);
  }

  public getState() {
    return this.store.getState();
  }

  public select<R>(
    selector: Selector<S, R>,
    operators: OperatorFunction<any, R>[] = [],
    notifyChange: boolean = true
  ): Observable<R> {
    return new Observable(subscriber => {
      let currentState = selector(this.store.getState());
      subscriber.next(currentState);

      const subscription = this.store.subscribe(() => {
        const nextState = selector(this.store.getState());
        if (currentState !== nextState) {
          subscriber.next(nextState);
          currentState = nextState;

          if (notifyChange) {
            this.cd.markForCheck();
          }
        }
      });

      subscriber.add(subscription);
    })
      .pipe(...operators)
      .pipe(distinctUntilChanged(), share());
  }
}
