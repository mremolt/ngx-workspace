import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_ENVIRONMENT, AppStore } from '@mr/ngx-tools';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { rootEpic } from './backend/root.epic';
import { rootReducer, IState } from './backend/root.reducer';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule } from '@angular/common/http';

const env = require(`../environments/${process.env.APP_ENV}`).settings;

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(APP_ROUTES, {
      useHash: false,
    }),
    BrowserModule,
    HttpClientModule,
    // App modules
    ComponentsModule,
  ],
  providers: [AppStore, { provide: LOCALE_ID, useValue: 'en' }, { provide: APP_ENVIRONMENT, useValue: env }],
})
export class AppModule {
  constructor(store: AppStore<IState>) {
    store.setup(rootReducer, rootEpic);
  }
}
