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
import { HeroSearchPresenter } from './hero-search.presenter';

@Component({
  selector: 'app-hero-search-ui',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [HeroSearchPresenter],
})
export class HeroSearchComponent implements OnDestroy, OnInit {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() search: EventEmitter<string> = new EventEmitter();
  private destroy: Subject<void> = new Subject();

  constructor(@Self() private presenter: HeroSearchPresenter) {}

  ngOnInit(): void {
    this.presenter.searchTerms$.pipe(
      // complete when component is destroyed
      takeUntil(this.destroy),
    ).subscribe(term => this.search.emit(term));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  searchFor(term: string): void {
    this.presenter.search(term);
  }
}
