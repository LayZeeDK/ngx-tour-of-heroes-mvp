import { fakeAsync, tick } from '@angular/core/testing';
import { asyncScheduler, BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, observeOn, takeUntil, tap } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchContainerComponent } from './hero-search.container';

describe(HeroSearchContainerComponent.name, () => {
  let container: HeroSearchContainerComponent;
  const destroy: Subject<void> = new Subject();
  const heroesObserver: jasmine.Spy = jasmine.createSpy('heroes observer');
  let searchSubscriptionCount = 0;
  const searchResults: BehaviorSubject<Hero[]> =
    new BehaviorSubject(femaleMarvelHeroes);
  const heroServiceStub: jasmine.SpyObj<HeroService> =
    createHeroServiceStub(searchResults);

  function createHeroServiceStub(searchResults$: Observable<Hero[]>): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'searchHeroes',
      ]);

    resetHeroServiceStub(searchResults$, stub);

    return stub;
  }

  function resetHeroServiceStub(
    searchResults$: Observable<Hero[]>,
    stub: jasmine.SpyObj<HeroService>,
  ): void {
    stub.searchHeroes
      .and.returnValue(searchResults$.pipe(
        observeOn(asyncScheduler),
        tap(() => searchSubscriptionCount += 1),
        finalize(() => searchSubscriptionCount -= 1),
      ))
      .calls.reset();
  }

  beforeEach(() => {
    container = new HeroSearchContainerComponent(heroServiceStub);
    container.heroes$.pipe(takeUntil(destroy)).subscribe(heroesObserver);
  });

  afterEach(() => {
    resetHeroServiceStub(searchResults, heroServiceStub);
    destroy.next();
    heroesObserver.calls.reset();
    searchSubscriptionCount = 0;
  });

  afterAll(() => {
    destroy.complete();
  });

  describe('emits filtered heroes', () => {
    it('when the user searches', fakeAsync(() => {
      const missMarvel = 'ms. marvel';

      container.search(missMarvel);
      tick();

      expect(heroesObserver).toHaveBeenCalledTimes(1);
    }));
  });

  describe('delegates search', () => {
    it(`delegates to ${HeroService.name}`, () => {
      const storm = 'storm';
      const medusa = 'medusa';

      container.search(storm);

      expect(heroServiceStub.searchHeroes).toHaveBeenCalledTimes(1);
      expect(heroServiceStub.searchHeroes).toHaveBeenCalledWith(storm);

      container.search(medusa);

      expect(heroServiceStub.searchHeroes).toHaveBeenCalledTimes(2);
      expect(heroServiceStub.searchHeroes).toHaveBeenCalledWith(medusa);
    });

    it('switches subscription when a new search is performed', fakeAsync(() => {
      const rogue = 'rogue';
      const blackWidow = 'black widow';
      const captainMarvel = 'captain marvel';

      expect(searchSubscriptionCount).toBe(0);

      container.search(rogue);
      tick();

      expect(searchSubscriptionCount).toBe(1);

      container.search(blackWidow);
      tick();

      expect(searchSubscriptionCount).toBe(1);

      container.search(captainMarvel);
      tick();

      expect(searchSubscriptionCount).toBe(1);
    }));
  });
});
