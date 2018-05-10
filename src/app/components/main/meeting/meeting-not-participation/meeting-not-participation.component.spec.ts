import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingNotParticipationComponent } from './meeting-not-participation.component';

describe('MeetingNotParticipationComponent', () => {
  let component: MeetingNotParticipationComponent;
  let fixture: ComponentFixture<MeetingNotParticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingNotParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingNotParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
