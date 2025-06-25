import { TestBed } from '@angular/core/testing';

import { XfsApiService } from './xfs-api.service';

xdescribe('XfsApiServiceService', () => {
  let service: XfsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       // Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
    });
    service = TestBed.inject(XfsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});