import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCorrectDialogComponent } from './meeting-correct-dialog.component';

describe('MeetingCorrectDialogComponent', () => {
  let component: MeetingCorrectDialogComponent;
  let fixture: ComponentFixture<MeetingCorrectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingCorrectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCorrectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
