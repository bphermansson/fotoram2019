import { TestBed } from '@angular/core/testing';

import { PictureApiService } from './picturesGet';

describe('PictureApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureApiService = TestBed.get(PictureApiService);
    expect(service).toBeTruthy();
  });
});
