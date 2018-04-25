import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent {
  topHeroes$: Observable<ReadonlyArray<Hero>>;

  constructor(heroService: HeroService) {
    this.topHeroes$ = heroService.getHeroes().pipe(
      map(heroes => heroes.slice(1, 5)),
    );
  }
}
