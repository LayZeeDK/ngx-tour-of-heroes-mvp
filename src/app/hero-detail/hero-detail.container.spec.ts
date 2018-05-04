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

describe('HeroDetailContainerComponent', () => {
  const blackWidow: Hero = femaleMarvelHeroes
    .find(x => x.name === 'Black Widow');
  let container: HeroDetailContainerComponent;
  let heroServiceStub: Partial<HeroService>;
  let locationStub: Partial<Location>;
  let routeParameters: Subject<Params>;
  let routeParametersSubscriptionCount: number;
  let routeFake: Partial<ActivatedRoute>;

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
      && typeof x.id === 'number'
      && typeof x.name === 'string';
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
      });
    routeFake = {
      paramMap: routeParameters$.pipe(
        observeOn(asyncScheduler)
      ),
    } as Partial<ActivatedRoute>;
    heroServiceStub = {
      getHero(id: number): Observable<Hero> {
        return observableOf(blackWidow, asyncScheduler);
      },
      updateHero(hero: Hero): Observable<any> {
        return observableOf(hero, asyncScheduler);
      },
    };
    spyOn(heroServiceStub, 'getHero').and.callThrough();
    spyOn(heroServiceStub, 'updateHero').and.callThrough();
    locationStub = {
      back(): void {},
    };
    spyOn(locationStub, 'back').and.callThrough();
    container = new HeroDetailContainerComponent(
      routeFake as ActivatedRoute,
      heroServiceStub as HeroService,
      locationStub as Location,
    );
  });

  afterEach(() => {
    routeParameters.complete();
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
