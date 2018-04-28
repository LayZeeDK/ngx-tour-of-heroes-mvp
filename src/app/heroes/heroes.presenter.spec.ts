import { HeroesPresenter } from './heroes.presenter';

describe('HeroesPresenter', () => {
  let presenter: HeroesPresenter;

  beforeEach(() => {
    presenter = new HeroesPresenter();
  });

  describe('it emits a hero name', () => {
    let addSpy: jasmine.Spy;

    beforeEach(() => {
      addSpy = jasmine.createSpy('heroNameSpy');
      presenter.add$.subscribe(addSpy);
    });

    it('when a user enters it', () => {
      const captainMarvel = 'Captain Marvel';

      presenter.addHero(captainMarvel);

      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(addSpy).toHaveBeenCalledWith(captainMarvel);
    });

    it('that is trimmed of white space', () => {
      const medusa = 'Medusa';

      presenter.addHero(' \t\t\t ' + medusa + ' \t\r\n  \r\n ');

      expect(addSpy).toHaveBeenCalledWith(medusa);
    });

    it('but ignores blank and white space names', () => {
      const blank = '';
      const whiteSpace = ' \r\n  \t   ';

      presenter.addHero(blank);
      presenter.addHero(whiteSpace);

      expect(addSpy).not.toHaveBeenCalled();
    });
  });
});
