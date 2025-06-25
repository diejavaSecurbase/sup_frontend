import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

xdescribe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
     TestBed.configureTestingModule({
      //   Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
