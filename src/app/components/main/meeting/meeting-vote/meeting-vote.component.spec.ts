import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingVoteComponent } from './meeting-vote.component';

describe('MeetingVoteComponent', () => {
  let component: MeetingVoteComponent;
  let fixture: ComponentFixture<MeetingVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
