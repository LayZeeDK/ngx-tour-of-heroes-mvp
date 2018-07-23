import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { multiScan } from 'rxjs-multi-scan';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-heroes',
  templateUrl: './heroes.container.html',
})
export class HeroesContainerComponent {
  private heroAdd: Subject<Hero> = new Subject();
  private heroRemove: Subject<Hero> = new Subject();

  heroes$: Observable<Hero[]> = multiScan(
    this.heroService.getHeroes(), (heroes, loadedHeroes) => [...heroes, ...loadedHeroes],
    // TODO: fix `multiScan` typing
    this.heroAdd as any, (heroes, hero) => [...heroes, hero],
    this.heroRemove as any, (heroes, hero) => heroes.filter(h => h !== hero),
    []);

  constructor(private heroService: HeroService) {}

  add(name: string): void {
    this.heroService.addHero({ name } as Hero)
      .subscribe(h => this.heroAdd.next(h));
  }

  delete(hero: Hero): void {
    this.heroRemove.next(hero);
    this.heroService.deleteHero(hero)
      .subscribe(
        undefined,
        () => this.heroAdd.next(hero));
  }
}
