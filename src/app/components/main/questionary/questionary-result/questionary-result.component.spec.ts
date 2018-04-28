import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryResultComponent } from './questionary-result.component';

describe('QuestionaryResultComponent', () => {
  let component: QuestionaryResultComponent;
  let fixture: ComponentFixture<QuestionaryResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
