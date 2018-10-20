import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent {
  topHeroes$: Observable<Hero[]> = this.heroService.getHeroes().pipe(
    map(heroes => heroes.slice(1, 5)),
  );

  constructor(private heroService: HeroService) {}
}
