import { TestBed } from '@angular/core/testing';

import { HuellaService } from './huella.service';

xdescribe('HuellaService', () => {
  let service: HuellaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       // Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
    });
    service = TestBed.inject(HuellaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
