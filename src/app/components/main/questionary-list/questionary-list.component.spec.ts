import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaryListComponent } from './questionary-list.component';

describe('QuestionaryListComponent', () => {
  let component: QuestionaryListComponent;
  let fixture: ComponentFixture<QuestionaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
