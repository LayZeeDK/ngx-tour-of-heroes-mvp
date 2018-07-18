import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

type HeroUpdate = 'add' | 'remove';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-heroes',
  templateUrl: './heroes.container.html',
})
export class HeroesContainerComponent {
  private addHero: Subject<Hero> = new Subject();
  private heroes: Subject<Hero[]> = new Subject();
  private initialHeroes = this.heroService.getHeroes().pipe(
    shareReplay(1),
  );
  private removeHero: Subject<Hero> = new Subject();

  heroes$: Observable<Hero[]>;

  constructor(private heroService: HeroService) {
    this.heroes$ = this.initializeHeroes();
  }

  add(name: string): void {
    this.heroService.addHero({ name } as Hero)
      .subscribe(h => this.addHero.next(h));
  }

  delete(hero: Hero): void {
    this.removeHero.next(hero);
    this.heroService.deleteHero(hero)
      .subscribe(
        undefined,
        () => this.addHero.next({ ...hero }));
  }

  private initializeHeroes(): Observable<Hero[]> {
    // TOOD: create heroes observable from initialHeroes, addHero and removeHero
    return new Subject<Hero[]>();
  }

  private addToHeroes(hero: Hero, heroes: Hero[]): Hero[] {
    return heroes.includes(hero)
      ? heroes
      : [
        ...heroes,
        hero,
      ];
  }

  private removeFromHeroes(hero: Hero, heroes: Hero[]): Hero[] {
    return heroes.filter(h => h !== hero);
  }
}
