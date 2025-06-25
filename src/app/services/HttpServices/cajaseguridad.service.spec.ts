import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnvService } from 'src/app/env.service';
import { ErrorService } from '../error.service';

import { CajaseguridadService } from './cajaseguridad.service';
import { ConsultasService } from './consultas.service';
import { LoginService } from './login.service';

import { ReporteIngreso } from 'src/app/DTO/reporte-ingreso';
import { ReporteDetalle } from 'src/app/DTO/reporte-detalle';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('CajaseguridadService', () => {
  let service: CajaseguridadService;
  let httpMock: HttpTestingController;
  let env: EnvService;

  beforeEach(() => {
      TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
          providers: [LoginService, HttpClient, EnvService, ErrorService, ConsultasService,{ provide: ActivatedRoute, useClass: FakeActivatedRoute }, { provide: Router, useClass: FakeRouter }, MessageService ],
          imports: [
            HttpClientTestingModule,
          ]
    });
    service = TestBed.inject(CajaseguridadService);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(EnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('consultaListadoCajas()', () => {
    service.consultaListadoCajas('dni', '4114141', 'arg');
  })

  it('consultaDetalleCaja()', () => {
    service.consultaDetalleCaja('1', '1');
  })

  it('should traer reporte detalle cajas', () => {

    let mock: ReporteDetalle[] = [{cuenta: '1', modeloCaja: '1', montoAdeudado: '20', nroCajaSeguridad: '12', nroContrato: '12', proximoVencimiento: '12-12-12', tipoContrato: 'e'}];

    service.getReporteDetalle('200', '1', '1', '20202012', '4', '80').subscribe(success => {
      expect(success).toEqual(mock);
    }, error => {
      fail();
    })

    let req = httpMock.expectOne(env.apiUrl + CajaseguridadService.ENDPOINTS.reporteDetalle + "?sucursal=200&caja_seguridad=1&numero_cuenta=1&numero_documento=20202012&tipo_documento=4&pais_documento=80");
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  })

  it('should traer reporte ingresos', () => {

    let mock: ReporteIngreso[] = [null, null, null];

    service.getReporteIngresos('200', 'fechaDesde', 'fechaHasta', 'user', 'numero', 'cuena', 'numDoc', 'tipoDoc', 'paisDoc').subscribe(success => {
      expect(success).toEqual(mock);
    });

    let req = httpMock.expectOne(env.apiUrl + CajaseguridadService.ENDPOINTS.reporteIngresos + "?sucursal=200&fecha_desde=fechaDesde&fecha_hasta=fechaHasta&usuario=user&caja_seguridad=numero&numero_cuenta=cuena&numero_documento=numDoc&tipo_documento=tipoDoc&pais_documento=paisDoc");
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  })
});
