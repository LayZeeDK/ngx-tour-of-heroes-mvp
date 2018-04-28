import { Component, Input } from '@angular/core';

import { Hero } from '../hero';

@Component({
  selector: 'app-dashboard-ui',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent {
  @Input() heroes: Hero[];
  @Input() title: string;
}
