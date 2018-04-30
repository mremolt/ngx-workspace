import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { StoreComponent } from '@mr/ngx-tools';
import { filter } from 'rxjs/operators';

export const greetingSelector = (state: any): string => {
  return state.greet;
};

@Component({
  selector: 'mr-greeting',
  templateUrl: './greeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingComponent extends StoreComponent implements OnInit {
  public greeting: string;

  public ngOnInit() {
    const greeting$ = this.select(greetingSelector, [filter((v: string) => v.length > 3)]);

    this.subscribeToObservable(greeting$, greeting => {
      this.greeting = greeting;
      console.warn('new greeting:', greeting);
    });

    this.dispatch({ type: 'GREET_WORLD' });
    this.dispatch({ type: 'GREET_WHO', payload: 'MR' });

    setTimeout(() => {
      this.dispatch({ type: 'GREET_WORLD' });
    }, 1000);

    setTimeout(() => {
      this.dispatch({ type: 'GREET_WHO', payload: 'Everybody' });
    }, 3000);
  }
}
