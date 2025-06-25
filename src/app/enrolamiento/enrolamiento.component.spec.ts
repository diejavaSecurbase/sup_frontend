import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { ParametrosEscaner } from '../DTO/parametros-escaner';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { LoginService } from '../services/HttpServices/login.service';
import { WebsocketService } from '../services/websocket.service';
import { EnrolamientoComponent } from './enrolamiento.component';
import { By } from '@angular/platform-browser';
import { Huella } from '../DTO/Huella';
import { XfsApiService } from '../services/huella/xfs-api.service';
import { WebsocketService2 } from '../services/huella/websocket2.service';
import { mockDomicilioYTelefono } from '../mocks/domicilioYTelefono';
import { mockCliente } from '../mocks/cliente';
import { mockIdentificacionCliente } from '../mocks/identificacionCliente';
import { mockParametrosEscaner } from '../mocks/parametrosEscaner';
import { domicilioMock, domicilioWithoutCodPostalMock } from '../mocks/domicilio';
import { mockTelefono } from '../mocks/telefono';

//Clases Fake
let url: UrlSegment[] = [];
let url1 = new UrlSegment('/', { name: 'test' });
url1.path = '/';
let url2 = new UrlSegment('/', { name: 'test' });
url2.path = '/';
url.push(url1, url2);
class FakeActivatedRoute {
  private url: Observable<UrlSegment[]>;
}
class FakeRouter {
  navigate(string:string) {
    console.log('Navegando a...',string);
  }
}
describe('EnrolamientoComponent', () => {
  let component: EnrolamientoComponent;
  let fixture: ComponentFixture<EnrolamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
// Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ EnrolamientoComponent ],
      providers: [ConsultasService, HuellaService, ErrorService, MessageService, LoginService, ConfirmationService, WebsocketService,EnvService,CajaseguridadService,
        {provide: ActivatedRoute,useValue: {url: of(url)}},
        { provide: Router, useClass: FakeRouter },],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
       //Servicios
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let loginServiceTest = TestBed.inject(LoginService);
    let huellasServiceTest = TestBed.inject(HuellaService);
    let servicioWebSocketTest = TestBed.inject(WebsocketService);
    let errorServiceTest = TestBed.inject(ErrorService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);

    //Espias
    let spygetDomicilioYTelefono = spyOn(consultasServiceTest, 'getDomicilioYTelefono').and.returnValue(of(mockDomicilioYTelefono));
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });
    let spygetCurrentClienteObservable = spyOn(consultasServiceTest, 'getCurrentClienteObservable').and.returnValue(of(mockCliente));
    let spygetDetalleCliente = spyOn(consultasServiceTest, 'getDetalleCliente').and.returnValue(of(mockCliente));
    let spygetCurrentIdObservable = spyOn(consultasServiceTest, 'getCurrentIdObservable').and.returnValue(of(mockIdentificacionCliente));
    let spygetSucursal = spyOn(loginServiceTest, 'getSucursal').and.returnValue(of('sucursal'));
    let spygetParametros = spyOn(consultasServiceTest, 'getParametros').and.returnValue(of(mockParametrosEscaner));
    let spycancelarEscaneo = spyOn(huellasServiceTest, 'cancelarEscaneo').and.returnValue(of(true));
    let spyverificarConexionBiometrico = spyOn(huellasServiceTest, 'verificarConexionBiometrico').and.returnValue(of(false));
    let spygetImagenHuella = spyOn(servicioWebSocketTest, 'getImagenHuella').and.returnValue(of('imagen'));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
   
    //Expects
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(spygetCurrentIdObservable).toHaveBeenCalled();
    expect(spygetSucursal).toHaveBeenCalled();
    expect(spygetParametros).toHaveBeenCalled();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(spyverificarConexionBiometrico).toHaveBeenCalled();
    expect(spygetImagenHuella).toHaveBeenCalled();

  });

  it('should create component', () => {
   
    //Servicios
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let loginServiceTest = TestBed.inject(LoginService);
    let huellasServiceTest = TestBed.inject(HuellaService);
    let servicioWebSocketTest = TestBed.inject(WebsocketService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let nuevoServicioWebSocketTest = TestBed.inject(WebsocketService2);
    let errorServiceTest = TestBed.inject(ErrorService);

    //Espias
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });
    let spygetCurrentClienteObservable = spyOn(consultasServiceTest, 'getCurrentClienteObservable').and.returnValue(of(mockCliente));
    let spygetDetalleCliente = spyOn(consultasServiceTest, 'getDetalleCliente').and.returnValue(of(mockCliente));
    let spygetCurrentIdObservable = spyOn(consultasServiceTest, 'getCurrentIdObservable').and.returnValue(of(mockIdentificacionCliente));
    let spygetSucursal = spyOn(loginServiceTest, 'getSucursal').and.returnValue(of('sucursal'));
    let spygetParametros = spyOn(consultasServiceTest, 'getParametros').and.returnValue(of(mockParametrosEscaner));
    let spycancelarEscaneo = spyOn(huellasServiceTest, 'cancelarEscaneo').and.returnValue(of(true));
    let spyverificarConexionBiometrico = spyOn(huellasServiceTest, 'verificarConexionBiometrico').and.returnValue(of(false));
    let spygetImagenHuella = spyOn(servicioWebSocketTest, 'getImagenHuella').and.returnValue(of('imagen'));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    //Expects
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(spygetCurrentIdObservable).toHaveBeenCalled();
    expect(spygetSucursal).toHaveBeenCalled();
    expect(spygetParametros).toHaveBeenCalled();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(spyverificarConexionBiometrico).toHaveBeenCalled();
    expect(spygetImagenHuella).toHaveBeenCalled();
  })

  it('volverBio()', fakeAsync(() => {
    let boton = fixture.debugElement.queryAll(By.css('.global-double-button > button'));
    boton[0].nativeElement.click();
    tick(501);
    expect(component.enrolamientoStatus.closed).toBeTrue();
  }));

  it('Should call escanear(), success', fakeAsync(() => {
    //Objetos
    let successgetParametros = new ParametrosEscaner();
    successgetParametros.anular_derecho = 1;
    successgetParametros.cantMinimaDedos = 1;
    successgetParametros.indice_derecho = 2;
    successgetParametros.indice_izquierdo = 2;
    successgetParametros.maxValorCalidadHuella = 10;
    successgetParametros.mayor_derecho = 2;
    successgetParametros.mayor_izquierdo = 2;
    successgetParametros.menique_derecho = 2;
    successgetParametros.menique_izquierdo = 2;
    successgetParametros.pulgar_derecho = 2;
    successgetParametros.pulgar_izquierdo = 2;
    component.parametrosBiometricos = successgetParametros;
    component.capturas = [];
    let huella = new Huella();
    huella.status = 'OK';
    huella.descripcionStatus = '1';
    huella.wsqBase64 = '1';
    huella.wsqPng = '1';
    huella.templateBase64 = '1';
    huella.nfiq = '1';

    //Boton escanear()
    let boton = fixture.debugElement.queryAll(By.css('.global-double-button > button'));
    //Servicios
    let huellasServiceTest = TestBed.inject(HuellaService);
    //Espias
    let escanearHuella = spyOn(huellasServiceTest, 'escanearHuella').and.returnValue(of(huella));
    boton[1].nativeElement.click();
    tick(1001);
    tick(501);
    tick(2001);

  }));

  xit('Should call escanear() Fail ', fakeAsync(() => {
    //Objetos
    let successgetParametros = new ParametrosEscaner();
    successgetParametros.anular_derecho = 1;
    successgetParametros.cantMinimaDedos = 1;
    successgetParametros.indice_derecho = 2;
    successgetParametros.indice_izquierdo = 2;
    successgetParametros.maxValorCalidadHuella = 0;
    successgetParametros.mayor_derecho = 2;
    successgetParametros.mayor_izquierdo = 2;
    successgetParametros.menique_derecho = 2;
    successgetParametros.menique_izquierdo = 2;
    successgetParametros.pulgar_derecho = 2;
    successgetParametros.pulgar_izquierdo = 2;
    component.parametrosBiometricos = successgetParametros;
    component.capturas = [];
    let huella = new Huella();
    huella.status = 'OK';
    huella.descripcionStatus = '1';
    huella.wsqBase64 = '1';
    huella.wsqPng = '1';
    huella.templateBase64 = '1';
    huella.nfiq = '1';

    //Boton escanear()
    let boton = fixture.debugElement.queryAll(By.css('.global-double-button > button'));
    //Servicios
    let huellasServiceTest = TestBed.inject(HuellaService);
    let errorServiceTest = TestBed.inject(ErrorService);
    //Espias
    let spyescanearHuella = spyOn(huellasServiceTest, 'escanearHuella').and.returnValue(of(huella));
    let spysetError = spyOn(errorServiceTest, 'setError').and.callThrough();
    boton[1].nativeElement.click();
    tick(1001);
    tick(501);
    tick(2001);

  }));

    it('Should create confirmed form',()=>{
      component.direccionLegal= domicilioMock;
      fixture.detectChanges();
      component.confirmarForm();
      
      expect(component.direccionLegal.codigoPostal).toBe('1406');
    });

    it('Should show the message when Codigo postal is null', () => {
      
      component.direccionLegal = domicilioWithoutCodPostalMock;
      
      let errorServiceTest = TestBed.inject(ErrorService);
      
      let spysetError = spyOn(errorServiceTest, 'setMessage').and.callFake(() => {
        return EMPTY;
      });
      fixture.detectChanges();
      component.confirmarForm();
      
      expect(spysetError).toHaveBeenCalledBefore;
    });

     it('Should update forms state if there is a telephone ', () => {
      component.opcionesTelefonos = [{label:null, value: '1234567'}];
      component.direccionLegal= domicilioMock;
      fixture.detectChanges();
      component.confirmarForm();
      
      expect(component.formStatus.closing).toBeTrue();
      expect(component.formStatus.opened).toBeFalse();
    }); 
    it('should update success - navegarHuellas()', () => {
      component.currentDedo = 2;
      component.currentCaptura = 1;
      component.capturas = [null, 'datoCapturado']; 
  
      component.navegarHuellas(1); 
  
      expect(component.esRecaptura).toBeFalse(); 
      expect(component.currentDedo).toBe(3); 
      expect(component.causaNoCapturable).toBeNull();
      expect(component.capturas[component.currentCaptura]).toBeNull(); 
    });

    it('Should update state when confirmarEnrolamiento() is called', fakeAsync(() => {
      // Valores iniciales
      component.enrolamientoStatus = {
        closing: false,
        closed: false,
        opened: true,
        opening: true
      };
      component.confirmacionStatus = {
        closed: true,
        closing: true,
        opened: false,
        opening: false
      };
      
      component.confirmarEnrolamiento();
  
      expect(component.esConfirmacionEnrolamiento).toBeTrue();
      expect(component.enrolamientoStatus.closing).toBeTrue();
      expect(component.enrolamientoStatus.opened).toBeFalse();
      expect(component.enrolamientoStatus.opening).toBeFalse();
      expect(component.activeIndex).toBe(2);
  
      // Simular el paso del tiempo (500ms)
      tick(500);
  
      expect(component.enrolamientoStatus.closed).toBeTrue();
      expect(component.confirmacionStatus).toEqual({
        closed: false,
        closing: false,
        opened: true,
        opening: true
      });
    }));
    
});
