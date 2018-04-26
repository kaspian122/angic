import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryActivityComponent } from './questionary-activity.component';

describe('QuestionaryActivityComponent', () => {
  let component: QuestionaryActivityComponent;
  let fixture: ComponentFixture<QuestionaryActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
