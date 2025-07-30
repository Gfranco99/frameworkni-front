import { TestBed } from '@angular/core/testing';

import { ValidadocsServiceService } from './validadocs.service.service';

describe('ValidadocsServiceService', () => {
  let service: ValidadocsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidadocsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
