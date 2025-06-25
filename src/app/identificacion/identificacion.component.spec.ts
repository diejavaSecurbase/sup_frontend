import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { IdentificacionComponent } from './identificacion.component';
import { HuellaService } from './../services/HttpServices/huella.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ErrorService } from '../services/error.service';
import { WebsocketService } from '../services/websocket.service';
import { Observable, Subscription, throwError } from 'rxjs';
import { ParametrosEscaner } from 'src/app/DTO/parametros-escaner';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '../env.service';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CheckboxControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Cliente } from '../DTO/cliente';
import { Telefono } from '../DTO/telefono';
import { Domicilio } from '../DTO/domicilio';
import { dirname } from 'path';
import { Caja } from './../DTO/Caja';
import { TipoDocumento } from '../DTO/tipo-documento';
import { Pais } from '../DTO/paises';
import { Huella } from '../DTO/Huella';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Error } from '../DTO/error';
import { ExpectedConditions } from 'protractor';
import { execFile } from 'child_process';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { XfsApiService } from '../services/huella/xfs-api.service';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}
describe('IdentificacionComponent', () => {
  let fixture: ComponentFixture<IdentificacionComponent>;
  let component: IdentificacionComponent;
  beforeEach(async(() => {}));

  beforeEach(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [IdentificacionComponent],
      providers: [
        HuellaService,
        ConsultasService,
        LoginService,
        EnvService,
        CajaseguridadService,
        ErrorService,
        WebsocketService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter },
        MessageService,
        CheckboxControlValueAccessor,
        XfsApiService
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(IdentificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('Deberia crearse una instancia', () => {
    let cajaSeguridadTest = TestBed.inject(CajaseguridadService);
    let huellaServiceTest = TestBed.inject(HuellaService);
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);

    //INICIALIZACION DE SERVICIOS
    let suscrip: Subscription[] = [];
    const tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    const dom = new Domicilio();
    dom.numero = '112';
    dom.calle = '9 De Julio';
    dom.departamento = 'A';
    dom.piso = '12';
    dom.codigoPostal = '1223';
    dom.pais_codigo = '80';
    dom.pais_descripcion = 'Argentina';
    dom.provincia_codigo = '1';
    dom.provincia_descripcion = 'Buenos Aires';
    dom.localidad_descripcion = 'Ciudad Autonoma de Buenos Aires';
    dom.localidad_codigo = '1';
    dom.legal = true;
    //ConsultasService.getCurrentClienteObservable()
    let cliente = new Cliente();
    cliente.id_persona = '2020';
    cliente.cuil = '20212223';
    cliente.fechaNacimiento = '11/11/11';
    cliente.genero = 'M';
    cliente.perfil_biometrico = true;
    cliente.nombre = 'Tester';
    cliente.apellido = 'Pro';
    cliente.numero_documento = '4141414141';
    cliente.pais_documento = '80';
    cliente.tipo_documento = 'dni';
    cliente.tipoSimboloDocumento = 'dni';
    cliente.pais_documento_descripcion = 'Argentina';
    cliente.problemas_enrolamiento = false;
    cliente.telefonos = [];
    cliente.telefonos.push(tel);
    cliente.domicilios = [];
    cliente.domicilios.push(dom);
    cliente.generoDesc = 'MASCULINO';

    const spyGetCurrentClienteObservable = spyOn(
      consultasServiceTest,
      'getCurrentClienteObservable'
    ).and.returnValue(of(cliente));

    //CajaseguridadService.cargarDatosCajas()
    let cajaCliente: Caja = new Caja();
    cajaCliente.empresa = 'SDC';
    cajaCliente.sucursal = '1';
    cajaCliente.cuenta = '123';
    cajaCliente.nroCajaSeguridad = '1';
    cajaCliente.maxCorrelativo = '1';
    cajaCliente.sucursalDescripcion = 'Tandil';
    cajaCliente.modeloCaja = '1';
    cajaCliente.estado = 'activo';
    cajaCliente.frecuenciaMes = '1';
    cajaCliente.frecuenciaDescripcion = 'Mensual';
    cajaCliente.novedades = 'ninguna';
    cajaCliente.tipoAcceso = 'admin';
    cajaCliente.titularidad = 'tester';
    cajaCliente.idCaja = '1';
    let cajasCliente: Caja[] = [];
    cajasCliente.push(cajaCliente);
    const spyConsultaListadoCajas = spyOn(
      cajaSeguridadTest,
      'consultaListadoCajas'
    ).and.returnValue(of(cajasCliente));

    //consultasService.getParametros()
    let params = new ParametrosEscaner();
    params.anular_derecho = 1;
    params.anular_izquierdo = 2;
    params.cantMinimaDedos = 1;
    params.indice_derecho = 3;
    params.indice_izquierdo = 4;
    params.maxValorCalidadHuella = 10;
    params.mayor_derecho = 5;
    params.mayor_izquierdo = 6;
    params.menique_derecho = 7;
    params.mayor_izquierdo = 8;
    params.pulgar_derecho = 9;
    params.pulgar_izquierdo = 10;
    const spygetParametros = spyOn(
      consultasServiceTest,
      'getParametros'
    ).and.returnValue(of(params));

    const status = '200';
    let spycancelarEscaneo = spyOn(
      huellaServiceTest,
      'cancelarEscaneo'
    ).and.returnValue(of(status));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
   
    let spyverificarConexionBiometrico = spyOn(
      huellaServiceTest,
      'verificarConexionBiometrico'
    ).and.returnValue(of(true));

    //consultasService.getTiposDocs()
    let arrTipoDocumento: TipoDocumento[] = [];
    let tipoDocumento1: TipoDocumento = new TipoDocumento();

    tipoDocumento1.id = '1';
    tipoDocumento1.codigoSoa = 'cs1';
    tipoDocumento1.label = '1';
    tipoDocumento1.orden = 1;

    let tipoDocumento2: TipoDocumento = new TipoDocumento();

    tipoDocumento2.id = '2';
    tipoDocumento2.codigoSoa = 'cs2';
    tipoDocumento2.label = '2';
    tipoDocumento2.orden = 2;

    let tipoDocumento3: TipoDocumento = new TipoDocumento();

    tipoDocumento3.id = '3';
    tipoDocumento3.codigoSoa = 'cs3';
    tipoDocumento3.label = '3';
    tipoDocumento3.orden = 3;

    arrTipoDocumento.push(tipoDocumento1);
    arrTipoDocumento.push(tipoDocumento2);
    arrTipoDocumento.push(tipoDocumento3);
    let spygetTiposDocs = spyOn(
      consultasServiceTest,
      'getTiposDocs'
    ).and.callFake(() => of(arrTipoDocumento));

    //consultasService.getPaises()
    let paises: Pais[] = [];

    let pais1 = new Pais();
    pais1.orden = 1;
    pais1.descripcion = 'Alemania';

    let pais2 = new Pais();
    pais2.orden = 2;
    pais2.descripcion = 'Brasil';

    let pais3 = new Pais();
    pais3.orden = 3;
    pais3.descripcion = 'Canada';

    paises.push(pais1);
    paises.push(pais2);
    paises.push(pais3);

    let spygetPaises = spyOn(consultasServiceTest, 'getPaises').and.returnValue(
      of(paises)
    );

    //Se llama al metodo ngOnInit() para poder crear la clase correctamente.
    component.ngOnInit();

    //EXPECTS de los spy.
    expect(spyGetCurrentClienteObservable).toHaveBeenCalled();
    expect(spyConsultaListadoCajas).toHaveBeenCalled();
    expect(spygetParametros).toHaveBeenCalled();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
   // expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(spyverificarConexionBiometrico).toHaveBeenCalled();
    expect(spygetTiposDocs).toHaveBeenCalled();
    expect(spygetPaises).toHaveBeenCalled();
    //EXPECTS de las variables del componente que han sido mofificadas en ngOnInit()
    expect(component.clienteCajas).toEqual(cliente);
    expect(component.cajas).toEqual(cajasCliente);
    expect(component.cajas).toEqual(cajasCliente);
    expect(component.parametrosBiometricos).toEqual(params);
    expect(component.tipoDoc).toEqual('cs1');
    expect(component.tiposDocs.length).toEqual(3);
    expect(component.paisesOrigen.length).toEqual(3);
    expect(component.pais).toEqual('80');
  });

  it('detenerCaptura()', () => {
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let boton = fixture.debugElement.query(By.css('.ui-button-warning'));
    let json = {
      status: '200',
    };
    let spycancelarEscaneo = spyOn(
      huellaServiceTest,
      'cancelarEscaneo'
    ).and.callFake(() => of(json));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
   
    boton.nativeElement.click();
    expect(component.escaneando).toEqual(false);
    expect(component.currentImagenDedo).toEqual(null);
    //expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    // expect(spycancelarEscaneo).toHaveBeenCalled();
  });

  it('escanear()', () => {
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let huella = new Huella();
    huella.status = 'ok';
    huella.descripcionStatus = 'ok';
    huella.wsqBase64 = 'ok';
    huella.wsqPng = 'ok';
    huella.templateBase64 = 'ok';
    huella.nfiq = '5';
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 10;
    component.parametrosBiometricos = params;
    fixture.detectChanges();
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let consultasServiceTest = TestBed.inject(ConsultasService);

    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    let spyidentificarCliente = spyOn(
      consultasServiceTest,
      'identificarCliente'
    ).and.returnValue(of(idCliente));
    let errorServiceTest = TestBed.inject(ErrorService);
    let error = new Error('Error TESTING', 'test', 'test', 'test');
    
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      errorServiceTest.setError(error, '1');
    });

    botonEscanear.nativeElement.click();

    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spyidentificarCliente).toHaveBeenCalled();
    expect(component.currentCalidad).toEqual(1);
  });

  it('rescanear()', () => {
    //Configuracion previa
    component.escanCompleto = true;
    fixture.detectChanges();
    //
    let botonRescanear = fixture.debugElement.query(By.css('.ui-button'));
    //Creo los servicios 'fake' y los spy para mockear el metodo que va a ser llamado.
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    
    let huella = new Huella();
    huella.status = 'ok';
    huella.descripcionStatus = 'ok';
    huella.wsqBase64 = 'ok';
    huella.wsqPng = 'ok';
    huella.templateBase64 = 'ok';
    huella.nfiq = '5';
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 10;
    component.parametrosBiometricos = params;
    fixture.detectChanges();
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let consultasServiceTest = TestBed.inject(ConsultasService);

    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    let spyidentificarCliente = spyOn(
      consultasServiceTest,
      'identificarCliente'
    ).and.returnValue(of(idCliente));
    let errorServiceTest = TestBed.inject(ErrorService);
    let error = new Error('Error TESTING', 'test', 'test', 'test');
    error.titulo;

    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      errorServiceTest.setError(error, '1');
    });

    botonRescanear.nativeElement.click();
    //EXPECTS
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spyidentificarCliente).toHaveBeenCalled();
    expect(component.currentCalidad).toEqual(1);
  });

  xit('verificar()', fakeAsync(() => {
    fixture.detectChanges();
    //Modifico variables del componente para habilitar el boton y asi poder agarrarlo.
    component.escaneando = false;
    component.esIngresoManual = false;
    component.identificando = false;
    component.escanCompleto = true;
    component.esVerificacion = true;
    component.pais = '';

    fixture.detectChanges();
    flush();
    let botonVerificar = fixture.debugElement.queryAll(By.css('.ui-button'));

    //Configuracion previa
    component.numDoc = 1;
    component.pais = 'Argentina';
    component.tipoDoc = '1';
    fixture.detectChanges();
    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    //Creo el servicio 'fake' y el spy para mockear el metodo que va a ser llamado.
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spyverificarCliente = spyOn(
      consultasServiceTest,
      'verificarCliente'
    ).and.returnValue(of(idCliente));

    //Clickeo el boton
    botonVerificar[1].nativeElement.click();

    //EXPECTS
    expect(spyverificarCliente).toHaveBeenCalled();
    expect(component.tipoIdentificacion).toBe('V');
  }));

  it('ingresoManual()', () => {
    //Configuracion previa
    component.numDoc = 1;
    component.pais = 'Argentina';
    component.tipoDoc = '1';
    //Creo el servicio 'fake' y el spy para mockear el metodo que va a ser llamado.
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let cliente = new Cliente();
    let spyverificarCliente = spyOn(
      consultasServiceTest,
      'buscarCliente'
    ).and.callFake(() => {
      component.numDoc = null;
      return of(cliente);
    });

    //Al no poder localizar el boton, llame al metodo directamente desde el componente.
    component.ingresoManual();

    //EXPECTS
    expect(component.numDoc).toEqual(null);
    expect(spyverificarCliente).toHaveBeenCalled();
    expect(component.tipoIdentificacion).toEqual('M');
  });

  it('buscarDeNuevo()', () => {
    //Configuracion previa, creo el servicio 'fake' y el spy para mockear el metodo que va a ser llamado.
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let json = {
      status: '200',
    };
    let spycancelarEscaneo = spyOn(
      huellaServiceTest,
      'cancelarEscaneo'
    ).and.callFake(() => of(json));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
   
    //Ejecuto el metodo
    component.buscarDeNuevo();
    
    //EXPECTS
    
   // expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(component.cajas).toBeNull();
  });

  it('detenerCaptura()', ()=>{
    let boton = fixture.debugElement.query(By.css('.ui-button-warning')).nativeElement;
    component.escaneando = true;
    fixture.detectChanges();
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneo = spyOn(huellaServiceTest, 'cancelarEscaneo').and.returnValue(of('200'));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    console.log(boton);
    
    boton.click();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(component.cancelando).toBeTrue();
    expect(component.escaneando).toBeFalse();
    expect(component.currentImagenDedo).toBeNull();
  })


  it('FAIL huellaService.cancelarEscaneo() -> SUCCESS checkearEstadoEscaner()', ()=>{
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneo = spyOn(huellaServiceTest, 'cancelarEscaneo').and.returnValue(throwError(new Error('','','','')));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    let spyverificarConexionBiometrico = spyOn(huellaServiceTest, 'verificarConexionBiometrico').and.returnValue(of(false));
    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    
   // expect(spycancelarEscaneo).toHaveBeenCalled();
    expect(spyverificarConexionBiometrico).toHaveBeenCalled();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    
    expect(component.esIngresoManual).toBeTrue();
  })

  it('FAIL huellaService.cancelarEscaneo() -> FAIL checkearEstadoEscaner()', ()=>{
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneo = spyOn(huellaServiceTest, 'cancelarEscaneo').and.returnValue(throwError(new Error('','','','')));
    let spyverificarConexionBiometrico = spyOn(huellaServiceTest, 'verificarConexionBiometrico').and.returnValue(throwError(new Error('','','','')));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
   // expect(spycancelarEscaneo).toHaveBeenCalled();
    
    expect(spyverificarConexionBiometrico).toHaveBeenCalled();
    expect(component.esIngresoManual).toBeTrue();
  })



  it('FAIL consultasService.getTiposDocs()', ()=>{
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spygetTiposDocs = spyOn(consultasServiceTest, 'getTiposDocs').and.returnValue(throwError(new Error('','','','')));
    component.ngOnInit();
    expect(component.tiposDocs).toEqual([{label: 'DNI', value: '4'}]);
    expect(component.tipoDoc).toEqual('4');
  })

  it('FAIL consultasService.getPaises()', ()=>{
    let consultasServiceTest  = TestBed.inject(ConsultasService);
    let spygetPaises = spyOn(consultasServiceTest, 'getPaises').and.returnValue(throwError(new Error('','','','')));
    component.ngOnInit();

    expect(spygetPaises).toHaveBeenCalled();
    expect(component.paisesOrigen).toEqual([{label: "Argentina", value: 80}]);
    expect(component.pais).toEqual('80');
  })


  it('FAIL verificar() -> ERROR', ()=>{
     //Modifico variables del componente para habilitar el boton y asi poder agarrarlo.
    component.escaneando = false;
    component.esIngresoManual = false;
    component.identificando = false;
    component.escanCompleto = true;
    component.esVerificacion = true;
    fixture.detectChanges();
    let botonVerificar = fixture.debugElement.queryAll(By.css('.ui-button'));

    //Configuracion previa
    component.numDoc = 1;
    component.pais = 'Argentina';
    component.tipoDoc = '1';
    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = false;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    //Creo el servicio 'fake' y el spy para mockear el metodo que va a ser llamado.
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spyverificarCliente = spyOn(
      consultasServiceTest,
      'verificarCliente'
    ).and.returnValue(throwError(idCliente));

    //Clickeo el boton
    botonVerificar[1].nativeElement.click();

    //EXPECTS
    expect(spyverificarCliente).toHaveBeenCalled();
    expect(component.falloVerificacion).toBeTrue();
    expect(component.esIngresoManual).toBeTrue();
    expect(component.documentoCliente).toEqual(idCliente.numero_documento);
    expect(component.enrolarCliente).toBeTrue();
  })

  it('FAIL verificar() -> ELSE', ()=>{
     //Modifico variables del componente para habilitar el boton y asi poder agarrarlo.
    component.escaneando = false;
    component.esIngresoManual = false;
    component.identificando = false;
    component.escanCompleto = true;
    component.esVerificacion = true;
    fixture.detectChanges();
    let botonVerificar = fixture.debugElement.queryAll(By.css('.ui-button'));

    //Clickeo el boton
    botonVerificar[1].nativeElement.click();

    //EXPECTS
    expect(botonVerificar).not.toBeNull();
  })

  it('FAIL escanear() -> SUCCESS -> IF -> ERROR', () => {
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let huella = new Huella();
    huella.status = 'ok';
    huella.descripcionStatus = 'ok';
    huella.wsqBase64 = 'ok';
    huella.wsqPng = 'ok';
    huella.templateBase64 = 'ok';
    huella.nfiq = '5';
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 10;
    component.parametrosBiometricos = params;
    fixture.detectChanges();
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spyidentificarCliente = spyOn(consultasServiceTest,'identificarCliente').and.returnValue(throwError(new Error('', '', '', '')));
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    
    botonEscanear.nativeElement.click();

    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spyidentificarCliente).toHaveBeenCalled();
    expect(component.currentCalidad).toEqual(1);
    expect(component.identificado).toEqual(false);
    expect(component.escanCompleto).toEqual(true);
    expect(component.esVerificacion).toEqual(true);
  });

  it('FAIL escanear() -> SUCCESS -> ELSE IF', () => {
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let huella = new Huella();
    huella.status = 'ok';
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 1;
    component.parametrosBiometricos = params;
    fixture.detectChanges();
    let errorServiceTest = TestBed.inject(ErrorService);
    let error = new Error('Error TESTING', 'test', 'test', 'test');
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      // errorServiceTest.setError(error, '1');
      return EMPTY;
    });
    botonEscanear.nativeElement.click();
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    
    component.escanear();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spysetError).toHaveBeenCalled();
    
    expect(component.escaneando).toEqual(false);
    expect(component.identificando).toEqual(false);
  });


  it('FAIL escanear() -> SUCCESS -> ELSE -> IF', () => {
    component.pais = ' ';
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    
    let huella = new Huella();
    huella.status = 'NOK';
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 1;
    component.parametrosBiometricos = params;
    component.cancelando = false;
    fixture.detectChanges();
    let errorServiceTest = TestBed.inject(ErrorService);
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });
    let spycancelarEscaneo = spyOn(huellaServiceTest, 'cancelarEscaneo').and.returnValue(of('200'));
    botonEscanear.nativeElement.click();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spycancelarEscaneo).toHaveBeenCalled();
    
    expect(spysetError).toHaveBeenCalled();
    expect(component.escaneando).toEqual(false);
    expect(component.identificando).toEqual(false);
  });

  it('FAIL escanear() -> SUCCESS -> ELSE -> ELSE', () => {
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
   
    let huella = new Huella();
    huella.status = 'NOK';
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(of(huella));
    let params = new ParametrosEscaner();
    params.maxValorCalidadHuella = 1;
    component.parametrosBiometricos = params;
    component.cancelando = true;
    fixture.detectChanges();
    botonEscanear.nativeElement.click();

    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    
    expect(component.cancelando).toEqual(false);
    expect(component.identificando).toEqual(false);
  });

  it('FAIL escanear() -> SUCCESS -> ELSE -> ELSE', () => {
    let botonEscanear = fixture.debugElement.query(By.css('.ui-button'));
    let servicioWebSocket = TestBed.inject(WebsocketService);
    let spyservicioWebSocket = spyOn(
      servicioWebSocket,
      'getImagenHuella'
    ).and.returnValue(of('test.png'));
    let huellaServiceTest = TestBed.inject(HuellaService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    
    let spyescanearHuella = spyOn(
      huellaServiceTest,
      'escanearHuella'
    ).and.returnValue(throwError(new Error(' ',' ',' ',' ')));
    let errorServiceTest = TestBed.inject(ErrorService);
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });
    botonEscanear.nativeElement.click();

    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyservicioWebSocket).toHaveBeenCalled();
    expect(spyescanearHuella).toHaveBeenCalled();
    expect(spysetError).toHaveBeenCalled();
    
    expect(component.identificando).toEqual(false);
    expect(component.escaneando).toEqual(false);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
