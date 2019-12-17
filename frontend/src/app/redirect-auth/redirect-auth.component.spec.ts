import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectAuthComponent } from './redirect-auth.component';

describe('RedirectAuthComponent', () => {
  let component: RedirectAuthComponent;
  let fixture: ComponentFixture<RedirectAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
