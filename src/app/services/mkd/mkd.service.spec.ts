import { TestBed, inject } from '@angular/core/testing';

import { MkdService } from './mkd.service';

describe('MkdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MkdService]
    });
  });

  it('should be created', inject([MkdService], (service: MkdService) => {
    expect(service).toBeTruthy();
  }));
});
