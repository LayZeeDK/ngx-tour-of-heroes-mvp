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
  private searchTerms: Subject<string> = new Subject();
  heroes$: Observable<Hero[]> = this.searchTerms.pipe(
    // switch to new search observable each time the term changes
    switchMap(term => this.heroService.searchHeroes(term)),
  );

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
