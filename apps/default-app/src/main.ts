import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { setupWorker } from '@mr/ngx-tools/service-worker';
import { AppModule } from './app/app.module';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
  setupWorker({ autoUpdate: 'confirm', updateMessage: 'Reload?' });
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (module.hot) {
  import('@mr/ngx-tools/hmr').then(m => {
    m.hmrBootstrap(module, bootstrap);
  });
} else {
  bootstrap();
}
