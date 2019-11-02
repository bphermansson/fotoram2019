import { TestBed } from '@angular/core/testing';

import { TempApiService } from './temp-api.service';

describe('TempApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TempApiService = TestBed.get(TempApiService);
    expect(service).toBeTruthy();
  });
});
