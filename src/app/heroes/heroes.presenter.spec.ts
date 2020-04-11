import { HeroesPresenter } from './heroes.presenter';

describe(HeroesPresenter.name, () => {
  let presenter: HeroesPresenter;

  beforeEach(() => {
    presenter = new HeroesPresenter();
  });

  describe('emits a hero name', () => {
    let addSpy: jasmine.Spy;

    beforeEach(() => {
      addSpy = jasmine.createSpy('heroNameSpy');
      presenter.add$.subscribe(addSpy);
    });
    afterEach(() => {
      presenter.ngOnDestroy();
    });

    it('when a user enters it', () => {
      const captainMarvel = 'Captain Marvel';

      presenter.nameControl.setValue(captainMarvel);
      presenter.addHero();

      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(addSpy).toHaveBeenCalledWith(captainMarvel);
    });

    it('that is trimmed of white space', () => {
      const medusa = 'Medusa';

      presenter.nameControl.setValue(' \t\t\t ' + medusa + ' \t\r\n  \r\n ');
      presenter.addHero();

      expect(addSpy).toHaveBeenCalledWith(medusa);
    });

    it('but ignores blank and white space names', () => {
      const blank = '';
      const whiteSpace = ' \r\n  \t   ';

      presenter.nameControl.setValue(blank);
      presenter.addHero();
      presenter.nameControl.setValue(whiteSpace);
      presenter.addHero();

      expect(addSpy).not.toHaveBeenCalled();
    });
  });
});
