import { fakeAsync, tick } from '@angular/core/testing';
import {
  asyncScheduler,
  Observable,
  of as observableOf,
  throwError,
} from 'rxjs';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesContainerComponent } from './heroes.container';

describe(HeroesContainerComponent.name, () => {
  let container: HeroesContainerComponent;
  let heroesSpy: jasmine.Spy;
  let heroServiceStub: Partial<HeroService>;

  beforeEach(() => {
    heroServiceStub = {
      addHero({ name }: Partial<Hero>): Observable<Hero> {
        return observableOf({
          id: 42,
          name,
        }, asyncScheduler);
      },
      deleteHero(hero: Hero): Observable<Hero> {
        return observableOf(hero, asyncScheduler);
      },
      getHeroes(): Observable<Hero[]> {
        return observableOf(femaleMarvelHeroes, asyncScheduler);
      }
    };
    spyOn(heroServiceStub, 'addHero').and.callThrough();
    spyOn(heroServiceStub, 'deleteHero').and.callThrough();
    spyOn(heroServiceStub, 'getHeroes').and.callThrough();
    container = new HeroesContainerComponent(
      heroServiceStub as HeroService);
    heroesSpy = jasmine.createSpy('heroesSpy');
    container.heroes$.subscribe(heroesSpy);
  });

  describe('emits all heroes', () => {
    it('all heroes are emitted after the init moment', fakeAsync(() => {
      container.ngOnInit();
      tick();

      expect(heroesSpy).toHaveBeenCalledTimes(1);
      expect(heroesSpy).toHaveBeenCalledWith(femaleMarvelHeroes);
    }));

    it(`by delegating to ${HeroService.name}`, () => {
      container.ngOnInit();

      expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);
    });
  });

  describe('adds a hero', () => {
    it(`by delegating to ${HeroService.name}`, () => {
      const hawkeye = 'Hawkeye (Kate Bishop)';

      container.add(hawkeye);

      expect(heroServiceStub.addHero).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.addHero).toHaveBeenCalledWith({ name: hawkeye });
    });

    it('and emits all heroes when server responds', fakeAsync(() => {
      const wonderWoman = 'Wonder Woman';
      container.ngOnInit();
      tick();

      container.add(wonderWoman);

      expect(heroesSpy).toHaveBeenCalledTimes(1);
      tick();

      expect(heroesSpy).toHaveBeenCalledTimes(2);
      expect(heroesSpy).toHaveBeenCalledWith([
        ...femaleMarvelHeroes,
        { id: 42, name: wonderWoman },
      ]);
    }));
  });

  describe('deletes a hero', () => {
    it(`by delegating to ${HeroService.name}`, () => {
      const gamora = femaleMarvelHeroes.find(x => x.name === 'Gamora');

      container.delete(gamora);

      expect(heroServiceStub.deleteHero).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.deleteHero).toHaveBeenCalledWith(gamora);
    });

    it('and emits heroes except the specified one immediately', fakeAsync(() => {
      const elektra = femaleMarvelHeroes.find(x => x.name === 'Elektra');
      container.ngOnInit();
      tick();

      expect(heroesSpy).toHaveBeenCalledTimes(1);
      container.delete(elektra);

      expect(heroesSpy).toHaveBeenCalledTimes(2);
      expect(heroesSpy).toHaveBeenCalledWith(
        femaleMarvelHeroes.filter(x => x.id !== elektra.id));
      tick();
    }));

    it('but emits the heroes including the specified one when server fails', fakeAsync(() => {
      function compareIdAscending(a: Hero, b: Hero): number {
        return a.id < b.id
          ? -1
          : a.id > b.id
          ? 1
          : 0;
      }

      const storm = femaleMarvelHeroes.find(x => x.name === 'Storm');
      heroServiceStub.deleteHero = (): Observable<Hero> =>
        throwError('timeout', asyncScheduler);
      container.ngOnInit();
      tick();

      expect(heroesSpy).toHaveBeenCalledTimes(1);
      container.delete(storm);

      expect(heroesSpy).toHaveBeenCalledTimes(2);
      tick();

      expect(heroesSpy).toHaveBeenCalledTimes(3);
      const emittedHeroes: Hero[] = heroesSpy.calls.mostRecent().args[0];
      emittedHeroes.sort(compareIdAscending);
      expect(emittedHeroes).toEqual(femaleMarvelHeroes);
    }));
  });
});
