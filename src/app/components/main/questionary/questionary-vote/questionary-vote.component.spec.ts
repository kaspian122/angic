import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryVoteComponent } from './questionary-vote.component';

describe('QuestionaryVoteComponent', () => {
  let component: QuestionaryVoteComponent;
  let fixture: ComponentFixture<QuestionaryVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
