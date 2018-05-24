import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryResultFreeAnswersComponent } from './questionary-result-free-answers.component';

describe('QuestionaryResultFreeAnswersComponent', () => {
  let component: QuestionaryResultFreeAnswersComponent;
  let fixture: ComponentFixture<QuestionaryResultFreeAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryResultFreeAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryResultFreeAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
