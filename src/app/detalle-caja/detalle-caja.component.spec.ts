import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';
import { Caja } from '../DTO/Caja';
import { DetalleCaja } from '../DTO/DetalleCaja';
import { PersonaAsociada } from '../DTO/PersonaAsociada';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { LoginService } from '../services/HttpServices/login.service';
import { WebsocketService } from '../services/websocket.service';

import { DetalleCajaComponent } from './detalle-caja.component';

class FakeActivatedRoute{

}

class FakeRouter{
  navigate(){
    console.log('LLEGASTE HASTA EL FINAL');
  }
}

//Este componente me daba error al compilar, no pude encontrar el error
describe('DetalleCajaComponent', () => {
  let component: DetalleCajaComponent;
  let fixture: ComponentFixture<DetalleCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [DetalleCajaComponent],
      providers: [ HuellaService,
        ConsultasService,
        LoginService,
        EnvService,
        CajaseguridadService,
        ErrorService,
        WebsocketService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter },
        MessageService],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    let detalleCaja = new DetalleCaja();
    let caja =  new Caja();
    detalleCaja.empresa, caja.empresa = 'test';
    detalleCaja.sucursal, caja.sucursal = 'test';
    detalleCaja.cuenta, caja.cuenta = 'test';
    detalleCaja.nroCajaSeguridad, caja.nroCajaSeguridad = 'test';
    detalleCaja.nroContrato = 'test';
    detalleCaja.fechaAltaContrato = 'test';
    detalleCaja.fechaProxVto = 'test';
    detalleCaja.fechaUltComision = 'test';
    detalleCaja.cobertura = 'test';
    detalleCaja.cobeturaEmpleados = 'test';
    detalleCaja.fechaUltIng = 'test';
    detalleCaja.horaUltIng = 'test';
    detalleCaja.usuarioUltIng = 'test';
    detalleCaja.monto = 'test';
    caja.maxCorrelativo = 'test';
    caja.sucursalDescripcion = 'test';
    caja.modeloCaja = 'test';
    caja.estado = 'test';
    caja.frecuenciaMes = 'test';
    caja.frecuenciaDescripcion = 'test';
    caja.novedades = 'test';
    caja.tipoAcceso = 'test';
    caja.titularidad = 'test';
    caja.idCaja = 'test';
    component.caja = caja;
    fixture.detectChanges();
    let persona = new PersonaAsociada();
    persona.tipoDoc = '1';
    persona.nroDoc = '41141414';
    persona.titularidad = 'test';
    persona.apellidoNombre = 'test';
    persona.tipoPersona = 'test';
    persona.enrolado = true;
    let personas: PersonaAsociada[] = [];
    personas.push(persona);
    personas.push(persona);
    personas.push(persona);
    detalleCaja.personas = personas;
    let cajasServiceTest = TestBed.inject(CajaseguridadService);
    let spyconsultaDetalleCaja = spyOn(cajasServiceTest, 'consultaDetalleCaja').and.returnValue(of(detalleCaja));
    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(spyconsultaDetalleCaja).toHaveBeenCalled();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
