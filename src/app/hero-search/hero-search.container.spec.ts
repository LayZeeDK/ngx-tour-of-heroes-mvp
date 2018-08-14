import { fakeAsync, tick } from '@angular/core/testing';
import {
  asapScheduler,
  BehaviorSubject,
  Observable,
  of as observableOf,
  Subject,
} from 'rxjs';
import { subscriptionCount } from 'rxjs-subscription-count';
import { takeUntil } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchContainerComponent } from './hero-search.container';

describe(HeroSearchContainerComponent.name, () => {
  let container: HeroSearchContainerComponent;
  const destroy: Subject<void> = new Subject();
  const heroesObserver: jasmine.Spy = jasmine.createSpy('heroes observer');
  let searchSubscriptionCount: BehaviorSubject<number>;
  let searchResults$: Observable<Hero[]>;
  let heroServiceStub: jasmine.SpyObj<HeroService>;
    // createHeroServiceStub(searchResults);

  function createHeroServiceStub(): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'searchHeroes',
      ]);

    resetHeroServiceStub(stub);

    return stub;
  }

  function resetHeroServiceStub(
    stub: jasmine.SpyObj<HeroService>,
  ): void {
    stub.searchHeroes
      .and.returnValue(searchResults$)
      .calls.reset();
  }

  beforeEach(() => {
    searchSubscriptionCount = new BehaviorSubject(0);
    searchResults$ = observableOf(femaleMarvelHeroes, asapScheduler).pipe(
      subscriptionCount(searchSubscriptionCount),
    );
    heroServiceStub = createHeroServiceStub();
    container = new HeroSearchContainerComponent(heroServiceStub);
    container.heroes$.pipe(takeUntil(destroy)).subscribe(heroesObserver);
  });

  afterEach(() => {
    destroy.next();
    heroesObserver.calls.reset();
    searchSubscriptionCount.complete();
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

    it('switches subscription when a new search is performed', () => {
      const rogue = 'rogue';
      const blackWidow = 'black widow';
      const captainMarvel = 'captain marvel';

      expect(searchSubscriptionCount.value).toBe(0);

      container.search(rogue);

      expect(searchSubscriptionCount.value).toBe(1);

      container.search(blackWidow);

      expect(searchSubscriptionCount.value).toBe(1);

      container.search(captainMarvel);

      expect(searchSubscriptionCount.value).toBe(1);
    });
  });
});
