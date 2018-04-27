import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-heroes-ui',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  @Input() heroes: Hero[];
  @Input() title: string;
  @Output() add: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<Hero> = new EventEmitter();

  addHero(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.add.emit(name);
  }
}
