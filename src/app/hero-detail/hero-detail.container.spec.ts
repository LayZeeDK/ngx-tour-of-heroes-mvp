import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import {
  asyncScheduler,
  Observable,
  Observer,
  of as observableOf,
  Subject,
  Subscription,
} from 'rxjs';
import { observeOn, take } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroDetailContainerComponent } from './hero-detail.container';

describe(HeroDetailContainerComponent.name, () => {
  const blackWidow: Hero = femaleMarvelHeroes
    .find(x => x.name === 'Black Widow');
  let container: HeroDetailContainerComponent;
  const heroServiceStub: jasmine.SpyObj<HeroService> = createHeroServiceStub();
  const locationStub: jasmine.SpyObj<Location> = createLocationStub();
  let routeParameters: Subject<Params>;
  let routeParametersSubscriptionCount: number;
  let activatedRouteFake: Partial<ActivatedRoute>;

  function createHeroServiceStub(): jasmine.SpyObj<HeroService> {
    const stub: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(
      HeroService.name,
      [
        'getHero',
        'updateHero',
      ]);
    resetHeroServiceStub(stub);

    return stub;
  }

  function createLocationStub(): jasmine.SpyObj<Location> {
    const stub: jasmine.SpyObj<Location> = jasmine.createSpyObj(
      Location.name,
      [
        'back',
      ]);

      resetLocationStub(stub);

      return stub;
  }

  function emitRouteParameters(parameters: { [key: string]: string }): void {
    routeParameters.next({
      get(name: string): string {
        return parameters[name];
      },
      has(name: string): boolean {
        return Object.keys(parameters).includes(name);
      },
    });
  }

  function isHero(x: any): x is Hero {
    return x != null
      && typeof x === 'object'
      && !Array.isArray(x)
      && typeof x.id === 'number'
      && typeof x.name === 'string';
  }

  function resetHeroServiceStub(stub: jasmine.SpyObj<HeroService>): void {
    stub.getHero
      .and.returnValue(observableOf(blackWidow, asyncScheduler))
      .calls.reset();
    stub.updateHero
      .and.callFake((hero: Hero) => observableOf(hero, asyncScheduler))
      .calls.reset();
  }

  function resetLocationStub(stub: jasmine.SpyObj<Location>): void {
    stub.back.calls.reset();
  }

  beforeEach(() => {
    routeParameters = new Subject();
    routeParametersSubscriptionCount = 0;
    const routeParameters$: Observable<Params> = Observable.create(
      (observer: Observer<Params>): () => void => {
        const routeParametersSubscription: Subscription = routeParameters
          .subscribe(observer);
        routeParametersSubscriptionCount += 1;

        return (): void => {
          routeParametersSubscription.unsubscribe();
          routeParametersSubscriptionCount -= 1;
        };
      }).pipe(
        observeOn(asyncScheduler),
      );
    activatedRouteFake = {
      paramMap: routeParameters$,
    } as Partial<ActivatedRoute>;
    container = new HeroDetailContainerComponent(
      activatedRouteFake as ActivatedRoute,
      heroServiceStub as HeroService,
      locationStub as Location);
  });

  afterEach(() => {
    routeParameters.complete();
    resetHeroServiceStub(heroServiceStub);
    resetLocationStub(locationStub);
  });

  it('navigates to the previous page', () => {
    container.goBack();

    expect(locationStub.back).toHaveBeenCalledTimes(1);
  });

  it('saves a hero', () => {
    container.save(blackWidow);

    expect(heroServiceStub.updateHero).toHaveBeenCalledTimes(1);
    expect(heroServiceStub.updateHero).toHaveBeenCalledWith(blackWidow);
  });

  describe('hero observable', () => {
    it('emits a hero when "id" route parameter changes', async () => {
      const emitHero: Promise<Hero> = container.hero$.pipe(
        take(1),
      ).toPromise();

      emitRouteParameters({ id: '1' });

      const hero: Hero = await emitHero;
      expect(isHero(hero)).toBe(true, 'it must be a hero');
    });

    it('subscribes to route parameter changes on hero subscription', () => {
      expect(routeParametersSubscriptionCount).toBe(0);

      container.hero$.subscribe();
      expect(routeParametersSubscriptionCount).toBe(1);
      emitRouteParameters({ id: '1' });

      expect(routeParametersSubscriptionCount).toBe(1);
    });
  });
});
