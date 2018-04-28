import { TestBed, inject } from '@angular/core/testing';

import { QuestionaryService } from './questionary.service';

describe('QuestionaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionaryService]
    });
  });

  it('should be created', inject([QuestionaryService], (service: QuestionaryService) => {
    expect(service).toBeTruthy();
  }));
});
