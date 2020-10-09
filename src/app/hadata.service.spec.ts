import { TestBed } from '@angular/core/testing';

import { HadataService } from './hadata.service';

describe('HadataService', () => {
  let service: HadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
