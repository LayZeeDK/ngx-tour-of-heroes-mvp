import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Hero } from '../hero';
import { HeroesPresenter } from './heroes.presenter';

@Component({
  selector: 'app-heroes-ui',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HeroesPresenter],
})
export class HeroesComponent implements OnInit {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() add: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<Hero> = new EventEmitter();
  get nameControl(): FormControl {
    return this.presenter.nameControl;
  }

  constructor(private presenter: HeroesPresenter) {}

  ngOnInit(): void {
    this.presenter.add$.subscribe(name => this.add.emit(name));
  }

  addHero(): void {
    this.presenter.addHero();
  }
}
