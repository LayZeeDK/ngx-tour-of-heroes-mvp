import { ApplicationRef, NgModuleRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

/**
 * Hot Module Replacement (live-reloading)
 *
 * See https://github.com/angular/angular-cli/wiki/stories-configure-hmr.
 */

interface NodeModule {
  readonly id: string;
}

export interface HmrNodeModule extends NodeModule {
  readonly hot: {
    readonly accept: () => void;
    readonly dispose: (fn: () => void) => void;
  };
}

export function isHmrNodeModule(x: Partial<HmrNodeModule>): x is HmrNodeModule {
  return x.hot !== undefined;
}

export function hmrBootstrap(
  module: HmrNodeModule,
  bootstrap: () => Promise<void | NgModuleRef<any>>,
): void {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();
  bootstrap()
    .then(x => x === undefined
      ? Promise.reject('No NgModuleRef')
      : Promise.resolve(x as NgModuleRef<any>))
    .then(x => ngModule = x)
    .catch(error => console.error(error));
  module.hot.dispose((): void => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements: ReadonlyArray<HTMLElement> =
      appRef.components.map(x => x.location.nativeElement);
    const makeVisible: () => void = createNewHosts(elements);
    ngModule.destroy();
    makeVisible();
  });
}
