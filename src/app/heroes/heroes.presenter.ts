import { Subject, Observable } from 'rxjs';

export class HeroesPresenter {
  private add: Subject<string> = new Subject();
  add$: Observable<string> = this.add.asObservable();

  public addHero(name: string): void {
    name = name.trim();

    if (!name) {
      return;
    }

    this.add.next(name);
  }
}
