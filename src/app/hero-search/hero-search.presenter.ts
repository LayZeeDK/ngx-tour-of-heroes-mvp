import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class HeroSearchPresenter {
  private searchTerms: Subject<string> = new Subject();
  searchTerms$: Observable<string> = this.searchTerms.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),
  );

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
