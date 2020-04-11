import { OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export class HeroesPresenter implements OnDestroy {
  private add: Subject<string> = new Subject();
  add$: Observable<string> = this.add.asObservable();
  nameControl = new FormControl('');

  ngOnDestroy(): void {
    this.add.complete();
  }

  public addHero(): void {
    const name = this.nameControl.value.trim();
    this.nameControl.setValue('');

    if (!name) {
      return;
    }

    this.add.next(name);
  }
}
