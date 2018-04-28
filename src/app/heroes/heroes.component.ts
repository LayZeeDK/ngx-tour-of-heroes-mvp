import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { HeroesPresenter } from './heroes.presenter';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-heroes-ui',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  providers: [HeroesPresenter],
})
export class HeroesComponent implements OnDestroy, OnInit {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() add: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<Hero> = new EventEmitter();
  private destroy: Subject<void> = new Subject();

  constructor(private presenter: HeroesPresenter) {}

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
