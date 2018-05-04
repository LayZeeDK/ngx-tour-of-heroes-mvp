import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  selector: 'app-heroes-ui',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [HeroesPresenter],
})
export class HeroesComponent implements OnDestroy, OnInit {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() add: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<Hero> = new EventEmitter();
  private destroy: Subject<void> = new Subject();

  constructor(@Self() private presenter: HeroesPresenter) {}

  ngOnInit(): void {
    this.presenter.add$.pipe(
      takeUntil(this.destroy),
    ).subscribe(name => this.add.emit(name));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  addHero(name: string): void {
    this.presenter.addHero(name);
  }
}
