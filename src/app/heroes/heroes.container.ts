import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

type HeroUpdate = 'add' | 'remove';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-heroes',
  templateUrl: './heroes.container.html',
})
export class HeroesContainerComponent {
  // TODO: can we replace it with ReplaySubject(1)?
  private heroes: BehaviorSubject<Hero[]> = new BehaviorSubject([]);
  private initialHeroes = this.heroService.getHeroes().pipe(
    shareReplay(1),
  );

  heroes$: Observable<Hero[]>;

  constructor(private heroService: HeroService) {
    this.heroes$ = this.initializeHeroes();
  }

  add(name: string): void {
    this.heroService.addHero({ name } as Hero)
      .subscribe(h => this.addHero(h));
  }

  delete(hero: Hero): void {
    this.removeHero(hero);
    this.heroService.deleteHero(hero)
      .subscribe(
        undefined,
        () => this.addHero({ ...hero }));
  }

  private initializeHeroes(): Observable<Hero[]> {
    // TODO: create heroes stream from initialHeroes, addHero and removeHero
    // Maybe create a custom observable?
    // TODO: only connect to initialHeroes on subscription to the merged stream
    return new Subject<Hero[]>();
  }

  private addHero(hero: Hero): void {
    this.heroes.pipe(
      first(),
    ).subscribe(heroes => this.heroes.next(this.appendToHeroes(hero, heroes)));
  }

  private addHeroes(additionalHeroes: Hero[]): void {
    this.heroes.pipe(
      first(),
    ).subscribe(heroes => this.heroes.next(
      this.appendMultipleToHeroes(additionalHeroes, heroes)));
  }

  private appendMultipleToHeroes(
    additionalHeroes: Hero[],
    heroes: Hero[],
  ): Hero[] {
    return [
      ...heroes,
      ...additionalHeroes.filter(h => !heroes.includes(h)),
    ];
  }

  private appendToHeroes(hero: Hero, heroes: Hero[]): Hero[] {
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

  private removeHero(hero: Hero): void {
    this.heroes.pipe(
      first(),
    ).subscribe(heroes => this.heroes.next(this.removeFromHeroes(hero, heroes)));
  }
}
