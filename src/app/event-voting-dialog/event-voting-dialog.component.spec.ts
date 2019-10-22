import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventVotingDialogComponent } from './event-voting-dialog.component';

describe('EventVotingDialogComponent', () => {
  let component: EventVotingDialogComponent;
  let fixture: ComponentFixture<EventVotingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventVotingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventVotingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
