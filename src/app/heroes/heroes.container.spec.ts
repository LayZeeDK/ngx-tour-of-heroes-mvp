import { fakeAsync, tick } from '@angular/core/testing';
import {
  asyncScheduler,
  Observable,
  of as observableOf,
  Subscription,
  throwError,
} from 'rxjs';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesContainerComponent } from './heroes.container';

describe(HeroesContainerComponent.name, () => {
  let heroesObserver: jasmine.Spy;
  let heroesSubscription: Subscription;
  let heroServiceStub: Partial<HeroService>;

  function createContainer(): HeroesContainerComponent {
    return new HeroesContainerComponent(heroServiceStub as HeroService);
  }

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
    heroesObserver = jasmine.createSpy('heroes observer');
    heroesSubscription = undefined;
  });
  afterEach(() => {
    if (heroesSubscription) {
      heroesSubscription.unsubscribe();
    }
  });

  describe('emits all heroes', () => {
    it('all heroes are emitted after subscribing', fakeAsync(() => {
      const container: HeroesContainerComponent = createContainer();

      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      expect(heroesObserver).toHaveBeenCalledWith(femaleMarvelHeroes);
    }));

    it(`by delegating to ${HeroService.name}`, () => {
      const container: HeroesContainerComponent = createContainer();

      heroesSubscription = container.heroes$.subscribe(heroesObserver);

      expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);
    });
  });

  describe('adds a hero', () => {
    it(`by delegating to ${HeroService.name}`, () => {
      const container: HeroesContainerComponent = createContainer();
      const hawkeye = 'Hawkeye (Kate Bishop)';

      container.add(hawkeye);

      expect(heroServiceStub.addHero).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.addHero).toHaveBeenCalledWith({ name: hawkeye });
    });

    it('and emits all heroes when server responds', fakeAsync(() => {
      const container: HeroesContainerComponent = createContainer();
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      const wonderWoman = 'Wonder Woman';
      tick();

      container.add(wonderWoman);

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(2);
      expect(heroesObserver).toHaveBeenCalledWith([
        ...femaleMarvelHeroes,
        { id: 42, name: wonderWoman },
      ]);
    }));
  });

  describe('deletes a hero', () => {
    it(`by delegating to ${HeroService.name}`, () => {
      const container: HeroesContainerComponent = createContainer();
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      const gamora = femaleMarvelHeroes.find(x => x.name === 'Gamora');

      container.delete(gamora);

      expect(heroServiceStub.deleteHero).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.deleteHero).toHaveBeenCalledWith(gamora);
    });

    it('and emits heroes except the specified one immediately', fakeAsync(() => {
      const container: HeroesContainerComponent = createContainer();
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      const elektra = femaleMarvelHeroes.find(x => x.name === 'Elektra');
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      container.delete(elektra);

      expect(heroesObserver).toHaveBeenCalledTimes(2);
      expect(heroesObserver).toHaveBeenCalledWith(
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

      const container: HeroesContainerComponent = createContainer();
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      tick();
      const storm = femaleMarvelHeroes.find(x => x.name === 'Storm');
      heroServiceStub.deleteHero = (): Observable<Hero> =>
        throwError('timeout', asyncScheduler);

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      container.delete(storm);

      expect(heroesObserver).toHaveBeenCalledTimes(2);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(3);
      const emittedHeroes: Hero[] = heroesObserver.calls.mostRecent().args[0];
      emittedHeroes.sort(compareIdAscending);
      expect(emittedHeroes).toEqual(femaleMarvelHeroes);
    }));
  });
});
