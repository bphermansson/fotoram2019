import { TestBed } from '@angular/core/testing';

import { HadataService } from './hadata.service';

describe('HadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HadataService = TestBed.get(HadataService);
    expect(service).toBeTruthy();
  });
});
