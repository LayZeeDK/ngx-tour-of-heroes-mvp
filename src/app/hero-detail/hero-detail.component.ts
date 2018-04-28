import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail-ui',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent {
  @Input() hero: Hero;
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() heroChange: EventEmitter<Hero> = new EventEmitter();
}
