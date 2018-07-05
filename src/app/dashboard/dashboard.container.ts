import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent {
  topHeroes$: Observable<Hero[]> = this.heroService.getHeroes().pipe(
    startWith([]),
    map(heroes => heroes.slice(1, 5)),
  );

  constructor(private heroService: HeroService) {}
}
