import { fakeAsync, tick } from '@angular/core/testing';
import { asyncScheduler, BehaviorSubject, Subject } from 'rxjs';
import { finalize, observeOn, takeUntil, tap } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchContainerComponent } from './hero-search.container';

describe(HeroSearchContainerComponent.name, () => {
  let container: HeroSearchContainerComponent;
  const destroy: Subject<void> = new Subject();
  const heroesObserver: jasmine.Spy = jasmine.createSpy('heroes observer');
  const heroSearch: BehaviorSubject<Hero[]> =
    new BehaviorSubject(femaleMarvelHeroes);
  let heroSearchSubscriptionCount = 0;
  const heroServiceStub: jasmine.SpyObj<HeroService> = createHeroServiceStub();

  function createHeroServiceStub(): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'searchHeroes',
      ]);

    resetHeroServiceStub(stub);

    return stub;
  }

  function resetHeroServiceStub(stub: jasmine.SpyObj<HeroService>): void {
    stub.searchHeroes
      .and.returnValue(heroSearch.pipe(
        observeOn(asyncScheduler),
        tap(() => heroSearchSubscriptionCount += 1),
        finalize(() => heroSearchSubscriptionCount -= 1),
      ))
      .calls.reset();
  }

  beforeEach(() => {
    container = new HeroSearchContainerComponent(heroServiceStub);
    container.heroes$.pipe(
      takeUntil(destroy),
    ).subscribe(heroesObserver);
  });

  afterEach(() => {
    resetHeroServiceStub(heroServiceStub);
    destroy.next();
    heroesObserver.calls.reset();
    heroSearchSubscriptionCount = 0;
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

      expect(heroSearchSubscriptionCount).toBe(0);

      container.search(rogue);
      tick();

      expect(heroSearchSubscriptionCount).toBe(1);

      container.search(blackWidow);
      tick();

      expect(heroSearchSubscriptionCount).toBe(1);

      container.search(captainMarvel);
      tick();

      expect(heroSearchSubscriptionCount).toBe(1);
    }));
  });
});
