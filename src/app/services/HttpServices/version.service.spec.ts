import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnvService } from 'src/app/env.service';
import { ErrorService } from '../error.service';

import { VersionService } from './version.service';
//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(() => {
      TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
          providers: [
              MessageService,
              HttpClient,
              ErrorService,
              EnvService,
              { provide: ActivatedRoute, useClass: FakeActivatedRoute },
              { provide: Router, useClass: FakeRouter },
          ],
          imports: [HttpClientTestingModule,]
    });
    service = TestBed.inject(VersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
