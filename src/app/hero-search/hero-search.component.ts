import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-search-ui',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnDestroy, OnInit {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() search: EventEmitter<string> = new EventEmitter();
  private destroy: Subject<void> = new Subject();
  private searchTerms: Subject<string> = new Subject();
  private searchTerms$: Observable<string> = this.searchTerms.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // complete when component is destroyed
    takeUntil(this.destroy),
  );

  ngOnInit(): void {
    this.searchTerms$.subscribe(term => this.search.emit(term));
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  searchFor(term: string): void {
    this.searchTerms.next(term);
  }
}
