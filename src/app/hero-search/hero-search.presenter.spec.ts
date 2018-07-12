import { fakeAsync, tick } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { HeroSearchPresenter } from './hero-search.presenter';

describe(HeroSearchPresenter.name, () => {
  let presenter: HeroSearchPresenter;

  beforeEach(() => {
    presenter = new HeroSearchPresenter();
  });

  describe('emits search terms', () => {
    const debounceTime = 300;
    let searchTermsSpy: jasmine.Spy;
    let searchTermsSubscription: Subscription;

    beforeEach(() => {
      searchTermsSpy = jasmine.createSpy('searchTermsSpy');
      searchTermsSubscription = presenter.searchTerms$
        .subscribe(searchTermsSpy);
    });

    afterEach(() => {
      searchTermsSubscription.unsubscribe();
    });

    it('when a user searches', fakeAsync(() => {
      const gamora = 'gamora';

      presenter.search(gamora);
      tick(debounceTime);

      expect(searchTermsSpy).toHaveBeenCalledTimes(1);
      expect(searchTermsSpy).toHaveBeenCalledWith(gamora);
    }));

    it(`after ${debounceTime} milliseconds of inactivity`, fakeAsync(() => {
      const elektra = 'elektra';

      presenter.search(elektra);
      tick(debounceTime - 1);

      expect(searchTermsSpy).not.toHaveBeenCalled();
      tick(1);

      expect(searchTermsSpy).toHaveBeenCalledTimes(1);
    }));

    it(`that is the latest preceeded by at most ${debounceTime - 1} milliseconds of inactivity`, fakeAsync(() => {
      const medusa = 'medusa';
      const wasp = 'wasp';

      presenter.search(medusa);
      tick(debounceTime - 1);
      presenter.search(wasp);

      expect(searchTermsSpy).not.toHaveBeenCalled();
      tick(debounceTime);

      expect(searchTermsSpy).toHaveBeenCalledTimes(1);
      expect(searchTermsSpy).toHaveBeenCalledWith(wasp);
    }));

    it('and ignores duplicates', fakeAsync(() => {
      const sheHulk = 'she-hulk';

      presenter.search(sheHulk);
      tick(debounceTime - 1);
      presenter.search(sheHulk);

      expect(searchTermsSpy).not.toHaveBeenCalled();
      tick(300);

      expect(searchTermsSpy).toHaveBeenCalledTimes(1);
      expect(searchTermsSpy).toHaveBeenCalledWith(sheHulk);
    }));

    it('but duplicates reset the inactivity period', fakeAsync(() => {
      const scarletWitch = 'scarlet witch';

      presenter.search(scarletWitch);
      tick(debounceTime - 1);
      presenter.search(scarletWitch);
      tick(1);

      expect(searchTermsSpy).not.toHaveBeenCalled();
      tick(300);

      expect(searchTermsSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
