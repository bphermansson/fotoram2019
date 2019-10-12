import { TestBed } from '@angular/core/testing';

import { GetGcalEventsService } from './get-gcal-events.service';

describe('GetGcalEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetGcalEventsService = TestBed.get(GetGcalEventsService);
    expect(service).toBeTruthy();
  });
});
