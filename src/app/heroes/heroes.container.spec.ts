import { fakeAsync, tick } from '@angular/core/testing';
import {
  asyncScheduler,
  of as observableOf,
  Subscription,
  throwError,
} from 'rxjs';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroesContainerComponent } from './heroes.container';

describe(HeroesContainerComponent.name, () => {
  function createHeroServiceStub(): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'addHero',
        'deleteHero',
        'getHeroes',
      ]);
    resetHeroServiceStub(stub);

    return stub;
  }

  function resetHeroServiceStub(stub: jasmine.SpyObj<HeroService>): void {
    stub.addHero
      .and.callFake(({ name }: Partial<Hero>) => observableOf({
        id: 42,
        name,
      }, asyncScheduler))
      .calls.reset();
    stub.deleteHero
      .and.callFake((hero: Hero) => observableOf(hero, asyncScheduler))
      .calls.reset();
    stub.getHeroes
      .and.returnValue(observableOf(femaleMarvelHeroes, asyncScheduler))
      .calls.reset();
  }

  let container: HeroesContainerComponent;
  let heroesObserver: jasmine.Spy;
  let heroesSubscription: Subscription;
  let heroServiceStub: jasmine.SpyObj<HeroService>;

  beforeAll(() => {
    heroServiceStub = createHeroServiceStub();
  });

  beforeEach(() => {
    container = new HeroesContainerComponent(heroServiceStub as HeroService);
    heroesObserver = jasmine.createSpy('heroes observer');
    heroesSubscription = undefined;
  });
  afterEach(() => {
    if (heroesSubscription) {
      heroesSubscription.unsubscribe();
    }
  });
  afterEach(() => {
    resetHeroServiceStub(heroServiceStub);
  });

  describe('emits all heroes', () => {
    it('all heroes are emitted after subscribing', fakeAsync(() => {
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      expect(heroesObserver).toHaveBeenCalledWith(femaleMarvelHeroes);
    }));

    it(`by delegating to ${HeroService.name}`, () => {
      heroesSubscription = container.heroes$.subscribe(heroesObserver);

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
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(1);
      const wonderWoman = 'Wonder Woman';

      container.add(wonderWoman);
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
      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      const gamora = femaleMarvelHeroes.find(x => x.name === 'Gamora');

      container.delete(gamora);

      expect(heroServiceStub.deleteHero).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.deleteHero).toHaveBeenCalledWith(gamora);
    });

    it('and emits heroes except the specified one immediately', fakeAsync(() => {
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

      heroesSubscription = container.heroes$.subscribe(heroesObserver);
      tick();
      const storm = femaleMarvelHeroes.find(x => x.name === 'Storm');
      heroServiceStub.deleteHero.and.returnValue(
        throwError('timeout', asyncScheduler));

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
