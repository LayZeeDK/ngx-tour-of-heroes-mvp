// #docregion
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap, HmrNodeModule, isHmrNodeModule } from './hmr';


declare const module: Partial<HmrNodeModule>;

function bootstrap(): Promise<void | NgModuleRef<AppModule>> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(error => console.log(error));
}

if (environment.production) {
  enableProdMode();
}

if (environment.hmr) {
  if (isHmrNodeModule(module)) {
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('Hot Module Replacement is disabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap();
}
