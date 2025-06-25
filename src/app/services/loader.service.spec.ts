import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      //Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
    
    it('show()', () => {
        service.show();
    })

    it('hide()', () => {
        service.hide();
    })
});
