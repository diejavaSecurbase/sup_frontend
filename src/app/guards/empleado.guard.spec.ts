import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { LoginService } from '../services/HttpServices/login.service';
import { EmpleadoGuard } from './empleado.guard';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}
class FakeRouterStateSnapshot{}

describe('EmpleadoGuard', () => {
  let guard: EmpleadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      providers: [
        HuellaService,
        ConsultasService,
        LoginService,
        EnvService,
        CajaseguridadService,
        ErrorService,
        MessageService,
        HttpClient,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter },
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        {import: RouterStateSnapshot, useClass: FakeRouterStateSnapshot}
      ]
    }).compileComponents();;
    guard = TestBed.inject(EmpleadoGuard);
  });

  xit('Deberia de crearse una instancia', () => {
    expect(guard).toBeTruthy();
  });

  xit('canActivate()', () => {
    let next = new ActivatedRouteSnapshot();
    // let state = new RouterStateSnapshot();
    // guard.canActivate(next,state);
  })
});
