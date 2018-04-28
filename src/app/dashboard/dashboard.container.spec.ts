import { asyncScheduler, Observable, of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { femaleMarvelHeroes } from '../../test/female-marvel-heroes';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { DashboardContainerComponent } from './dashboard.container';

describe('DashboardContainerComponent', () => {
  describe('emits top heroes', () => {
    let component: DashboardContainerComponent;
    let heroServiceStub: Partial<HeroService>;

    beforeEach(() => {
      heroServiceStub = {
        getHeroes(): Observable<Hero[]> {
          return observableOf(femaleMarvelHeroes, asyncScheduler);
        },
      };
      spyOn(heroServiceStub, 'getHeroes').and.callThrough();
      component = new DashboardContainerComponent(
        heroServiceStub as HeroService);
    });

    it('initially emits an empty array', () => {
      component.topHeroes$.pipe(
        first(),
      ).subscribe(heroes => expect(heroes.length).toBe(0));
    });

    it('emits the top 4 heroes', async () => {
      const heroes: Hero[] = await component.topHeroes$.toPromise();

      expect(heroes.length).toBe(4);
      expect(heroes[0]).toEqual({ id: 2, name: 'Captain Marvel' });
    });

    it(`delegates to ${HeroService.prototype.constructor.name} immediately`, async () => {
      expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);

      await component.topHeroes$.toPromise();

      expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);
    });
  });
});
