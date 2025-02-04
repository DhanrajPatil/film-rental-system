import { TestBed } from '@angular/core/testing';

import { FilmEditDeactivateGuardGuard } from './film-edit-deactivate-guard.guard';

describe('FilmEditDeactivateGuardGuard', () => {
  let guard: FilmEditDeactivateGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FilmEditDeactivateGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
