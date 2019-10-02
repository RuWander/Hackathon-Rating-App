import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsBlocksComponent } from './results-blocks.component';

describe('ResultsBlocksComponent', () => {
  let component: ResultsBlocksComponent;
  let fixture: ComponentFixture<ResultsBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
