import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.container.html',
})
export class HeroSearchContainerComponent {
  heroes$: Observable<ReadonlyArray<Hero>>;

  private searchTerms: Subject<string> = new Subject();

  constructor(private heroService: HeroService) {
    this.heroes$ = this.searchTerms.pipe(
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
