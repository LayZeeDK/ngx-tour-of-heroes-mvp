import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardContainerComponent } from './dashboard/dashboard.container';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import {
  HeroDetailContainerComponent,
} from './hero-detail/hero-detail.container';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import {
  HeroSearchContainerComponent,
} from './hero-search/hero-search.container';
import { HeroesComponent } from './heroes/heroes.component';
import { InMemoryDataService } from './in-memory-data.service';
import { MessagesComponent } from './messages/messages.component';
import { HeroesContainerComponent } from './heroes/heroes.container';
import { MessagesContainerComponent } from './messages/messages.container';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    DashboardContainerComponent,
    HeroesComponent,
    HeroesContainerComponent,
    HeroDetailComponent,
    HeroDetailContainerComponent,
    MessagesComponent,
    MessagesContainerComponent,
    HeroSearchComponent,
    HeroSearchContainerComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
