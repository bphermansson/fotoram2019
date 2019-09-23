import { TestBed } from '@angular/core/testing';

import { RestApiService } from './picturesGet';

describe('RestApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestApiService = TestBed.get(RestApiService);
    expect(service).toBeTruthy();
  });
});
