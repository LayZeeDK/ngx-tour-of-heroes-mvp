import { APP_BASE_HREF } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@Component({
  template: `
    <app-root-ui
      [title]="title"></app-root-ui>
  `,
})
class TestHostComponent {
  title = 'Tour of Heroes';
}

describe(AppComponent.name, () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let componentDebug: DebugElement;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, TestHostComponent],
      imports: [RouterModule.forRoot([])],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    componentDebug = fixture.debugElement.query(By.directive(AppComponent));
    component = componentDebug.componentInstance;
    fixture.detectChanges();
  });
  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
  it(`should have a title`, async(() => {
    expect(component.title).toEqual('Tour of Heroes');
  }));
  it('should render title in a h1 tag', async(() => {
    const compiled = componentDebug.nativeElement;

    expect(compiled.querySelector('h1').textContent).toContain('Tour of Heroes');
  }));
});
