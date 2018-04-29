import { Directive } from '@angular/core';

import { HeroSearchContainerComponent } from './hero-search.container';

@Directive({
  exportAs: 'heroSearchProvider',
  // tslint:disable-next-line:directive-selector
  selector: 'app-hero-search-ui',
})
// tslint:disable-next-line:directive-class-suffix
export class HeroSearchProvider extends HeroSearchContainerComponent {}
