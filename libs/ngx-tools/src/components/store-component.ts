import { ChangeDetectorRef } from '@angular/core';
import { AppStore } from '@mr/ngx-tools';
import { AnyAction } from 'redux';
import { Selector } from 'reselect';
import { Observable, OperatorFunction } from 'rxjs';
import { take } from 'rxjs/operators';
import { ContainerComponent } from './container-component.class';
import { ISelectorMapping, IProps } from '../services/app-store';
import { flatEquals } from '../utils/flat-equals';

export class StoreComponent<S extends object = any, P extends IProps = {}> extends ContainerComponent {
  protected _props = {};

  get props(): P {
    return this._props as P;
  }

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
    if (notifyChange) {
      return this.store.select(selector, operators, () => {
        this.cd.markForCheck();
      });
    } else {
      return this.store.select(selector, operators);
    }
  }

  public dispatchIfNotLoaded(loaded$: Observable<boolean>, callback: () => AnyAction): void {
    this.subscribeToObservable(loaded$.pipe(take(1)), loaded => {
      if (!loaded) {
        this.dispatch(callback());
      }
    });
  }

  public mapStateToProps(selectors: ISelectorMapping<S>) {
    let currentValue: any;

    this.subscribeToObservable(this.store.selectMulti(selectors), data => {
      if (!flatEquals(data, currentValue)) {
        this._props = data;
        currentValue = data;
        this.cd.markForCheck();
      }
    });
  }
}
