import { asyncScheduler, Observable, of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { DashboardContainerComponent } from './dashboard.container';

const femaleMarvelHeroes: Hero[] = [
  { id: 1, name: 'Black Widow' },
  { id: 2, name: 'Captain Marvel' },
  { id: 3, name: 'Medusa' },
  { id: 4, name: 'Ms. Marvel' },
  { id: 5, name: 'Scarlet Witch' },
  { id: 6, name: 'She-Hulk' },
  { id: 7, name: 'Storm' },
  { id: 8, name: 'Wasp' },
  { id: 9, name: 'Rogue' },
  { id: 10, name: 'Elektra' },
  { id: 11, name: 'Gamora' },
  { id: 12, name: 'Hawkeye (Kate Bishop)' },
];

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

    it(`delegates to ${HeroService.prototype.constructor.name}`, () => {
      component.topHeroes$.subscribe();

      expect(heroServiceStub.getHeroes).toHaveBeenCalledTimes(1);
    });
  });
});
