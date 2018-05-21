import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { StoreComponent, IApiAction, API_ACTION } from '@mr/ngx-tools';
import { filter } from 'rxjs/operators';
import { IState } from '../backend/root.reducer';

export const greetingSelector = (state: any): string => {
  return state.greet;
};

@Component({
  selector: 'mr-greeting',
  templateUrl: './greeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingComponent extends StoreComponent<IState, { greeting: string }> implements OnInit {
  public greeting: string;

  public ngOnInit() {
    console.log('hier');

    const greeting$ = this.select(greetingSelector, [filter((v: string) => v.length > 3)]);

    this.subscribeToObservable(greeting$, greeting => {
      this.greeting = greeting;
      console.warn('new greeting:', greeting);
    });

    this.mapStateToProps({ greeting: greetingSelector });

    this.dispatch({ type: 'GREET_WORLD' });
    this.dispatch({ type: 'GREET_WHO', payload: 'MR' });

    setTimeout(() => {
      this.dispatch({ type: 'GREET_WORLD' });
    }, 1000);

    setTimeout(() => {
      this.dispatch({ type: 'GREET_WHO', payload: 'Everybody' });
    }, 3000);

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

    this.dispatch(action);
  }
}
