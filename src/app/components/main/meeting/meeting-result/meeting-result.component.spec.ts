import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingResultComponent } from './meeting-result.component';

describe('MeetingResultComponent', () => {
  let component: MeetingResultComponent;
  let fixture: ComponentFixture<MeetingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
