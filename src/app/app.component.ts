import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root-ui',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input() title: string;
}
