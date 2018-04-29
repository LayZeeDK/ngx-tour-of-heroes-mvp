import { Directive, Host, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeroService } from '../hero.service';
import { HeroSearchComponent } from './hero-search.component';
import { HeroSearchContainerComponent } from './hero-search.container';

@Directive({
  exportAs: 'appHeroSearch',
  selector: '[appHeroSearch]',
})
export class HeroSearchDirective
extends HeroSearchContainerComponent
implements OnDestroy, OnInit {
  private destroy: Subject<void> = new Subject();

  constructor(heroService: HeroService,
    @Host() private component: HeroSearchComponent) {
    super(heroService);
  }

  ngOnInit(): void {
    this.heroes$.pipe(
      takeUntil(this.destroy),
    ).subscribe(heroes => this.component.heroes = heroes);
    this.component.title = 'Hero Search';
    this.component.search.pipe(
      takeUntil(this.destroy),
    ).subscribe(searchTerms => this.search(searchTerms));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
