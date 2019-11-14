import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCreationComponent } from './party-creation.component';

describe('PartyCreationComponent', () => {
  let component: PartyCreationComponent;
  let fixture: ComponentFixture<PartyCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
