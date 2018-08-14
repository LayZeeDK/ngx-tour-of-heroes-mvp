import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  asapScheduler,
  BehaviorSubject,
  of as observableOf,
  Subject,
} from 'rxjs';
import { subscriptionCount } from 'rxjs-subscription-count';
import { observeOn, take } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroDetailContainerComponent } from './hero-detail.container';

describe(HeroDetailContainerComponent.name, () => {
  const blackWidow: Hero = femaleMarvelHeroes
    .find(x => x.name === 'Black Widow');
  const heroServiceStub: jasmine.SpyObj<HeroService> = createHeroServiceStub();
  const locationStub: jasmine.SpyObj<Location> = createLocationStub();
  let routeParameters: Subject<ParamMap>;
  let routeParametersSubscriptionCount: BehaviorSubject<number>;
  let activatedRouteFake: ActivatedRoute;

  function createContainer(): HeroDetailContainerComponent {
    return new HeroDetailContainerComponent(
      activatedRouteFake,
      heroServiceStub,
      locationStub);
  }

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
      get keys(): string[] {
        return Object.keys(parameters);
      },
      get(name: string): string | null {
        return parameters[name] || null;
      },
      getAll(name: string): string[] {
        return this.has(name)
          ? [parameters[name]]
          : [];
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
      .and.returnValue(observableOf(blackWidow, asapScheduler))
      .calls.reset();
    stub.updateHero
      .and.callFake((hero: Hero) => observableOf(hero, asapScheduler))
      .calls.reset();
  }

  function resetLocationStub(stub: jasmine.SpyObj<Location>): void {
    stub.back.calls.reset();
  }

  beforeEach(() => {
    routeParameters = new Subject();
    routeParametersSubscriptionCount = new BehaviorSubject(0);
    activatedRouteFake = {
      paramMap: routeParameters.asObservable().pipe(
        subscriptionCount(routeParametersSubscriptionCount),
        observeOn(asapScheduler),
      ),
    } as Partial<ActivatedRoute> as any;
  });

  afterEach(() => {
    routeParameters.complete();
    routeParametersSubscriptionCount.complete();
    resetHeroServiceStub(heroServiceStub);
    resetLocationStub(locationStub);
  });

  it('navigates to the previous page', () => {
    const container: HeroDetailContainerComponent = createContainer();

    container.goBack();

    expect(locationStub.back).toHaveBeenCalledTimes(1);
  });

  it('saves a hero', () => {
    const container: HeroDetailContainerComponent = createContainer();

    container.save(blackWidow);

    expect(heroServiceStub.updateHero).toHaveBeenCalledTimes(1);
    expect(heroServiceStub.updateHero).toHaveBeenCalledWith(blackWidow);
  });

  describe('hero observable', () => {
    it('emits a hero when "id" route parameter changes', async () => {
      const container: HeroDetailContainerComponent = createContainer();
      const emitHero: Promise<Hero> = container.hero$.pipe(
        take(1),
      ).toPromise();

      emitRouteParameters({ id: '1' });

      const hero: Hero = await emitHero;
      expect(isHero(hero)).toBe(true, 'it must be a hero');
    });

    it('subscribes to route parameter changes on hero subscription', () => {
      const container: HeroDetailContainerComponent = createContainer();

      expect(routeParametersSubscriptionCount.value).toBe(0);
      container.hero$.subscribe();

      expect(routeParametersSubscriptionCount.value).toBe(1);
      emitRouteParameters({ id: '1' });

      expect(routeParametersSubscriptionCount.value).toBe(1);
    });
  });
});
