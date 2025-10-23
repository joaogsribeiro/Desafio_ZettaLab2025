import { TestBed } from '@angular/core/testing';

import { PotterdbApi } from './potterdb-api';

describe('PotterdbApi', () => {
  let service: PotterdbApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotterdbApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
