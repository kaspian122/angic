import { TestBed, inject } from '@angular/core/testing';

import { HolderService } from './holder.service';

describe('HolderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolderService]
    });
  });

  it('should be created', inject([HolderService], (service: HolderService) => {
    expect(service).toBeTruthy();
  }));
});
