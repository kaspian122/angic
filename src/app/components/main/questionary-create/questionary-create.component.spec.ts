import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryCreateComponent } from './questionary-create.component';

describe('QuestionaryCreateComponent', () => {
  let component: QuestionaryCreateComponent;
  let fixture: ComponentFixture<QuestionaryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
