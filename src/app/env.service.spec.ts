import { TestBed, inject } from '@angular/core/testing';

import { EnvService } from './env.service';

xdescribe('EnvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      providers: [EnvService]
    });
  });

  it('should be created', inject([EnvService], (service: EnvService) => {
    expect(service).toBeTruthy();
  }));
});