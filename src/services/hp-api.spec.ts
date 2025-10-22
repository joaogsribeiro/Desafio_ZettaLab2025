import { TestBed } from '@angular/core/testing';

import { HpApi } from './hp-api';

describe('HpApi', () => {
  let service: HpApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HpApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
