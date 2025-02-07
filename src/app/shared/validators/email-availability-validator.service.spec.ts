import { TestBed } from '@angular/core/testing';

import { EmailAvailabilityValidatorService } from './email-availability-validator.service';

describe('EmailAvailabilityValidatorService', () => {
  let service: EmailAvailabilityValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAvailabilityValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
