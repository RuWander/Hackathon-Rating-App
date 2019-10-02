import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsResultsDisplayComponent } from './events-results-display.component';

describe('EventsResultsDisplayComponent', () => {
  let component: EventsResultsDisplayComponent;
  let fixture: ComponentFixture<EventsResultsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsResultsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsResultsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
