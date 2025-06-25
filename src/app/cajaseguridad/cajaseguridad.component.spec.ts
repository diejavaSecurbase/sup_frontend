import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { CajaseguridadComponent } from './cajaseguridad.component';
import { Caja } from '../DTO/Caja';
import { ErrorService } from '../services/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { LoginService } from '../services/HttpServices/login.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';
import { EMPTY, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Cliente } from '../DTO/cliente';
import { Domicilio } from '../DTO/domicilio';
import { Telefono } from '../DTO/telefono';
import { compileNgModule } from '@angular/compiler';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { PersonaRecinto } from '../DTO/PersonaRecinto';
import { Documento } from '../DTO/documento';
import { Error } from '../DTO/error';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('CajaseguridadComponent', () => {
  let component: CajaseguridadComponent;
  let fixture: ComponentFixture<CajaseguridadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ CajaseguridadComponent ],
      providers: [
        ErrorService,
        CajaseguridadService,
        LoginService,
        ConfirmationService,
        ConsultasService,
        MessageService,
        HttpClient,
        EnvService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter }
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        MessageModule,
        MessagesModule
      ],
       schemas: [
      NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaseguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    fixture = TestBed.createComponent(CajaseguridadComponent);
    component = fixture.componentInstance;
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
    let cajasCliente: Caja[] = [cajaCliente, cajaCliente, cajaCliente];
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    cliente.emails = [];
    component.currentCliente = cliente;
    component.cajasSeguridad = cajasCliente;
    fixture.detectChanges();
    
    component.tipoIdentificacion = '';
    let loginServiceTest = TestBed.inject(LoginService);
    loginServiceTest.setSucursal('Tandil');
    let spygetSucursal = spyOn(loginServiceTest, 'getSucursal').and.returnValue(of('Tandil'));
    fixture.detectChanges();
    flush();
    let html = fixture.debugElement.query(By.css('.contenedor-cliente'));
    
    fixture.detectChanges();
    flush();


    component.ngOnInit();

    expect(component.cabeceras.length).toEqual(6);
    expect(component.currentSucursal).toEqual('Tandil');
    expect(spygetSucursal).toHaveBeenCalled();
    expect(component).toBeTruthy();
  }));


  it('abrirDetalleCaja()', ()=>{
    let caja = new Caja();
    component.cajasSeguridad = [caja,caja,caja];
    component.abrirDetalleCaja(caja);
    
    expect(component.pantallaActual).toEqual('Detalle');
    expect(component.cajaSeleccionada).toEqual(caja);
  })

  it('abrirEstadoRecinto() -> IF', ()=>{
    let boton = fixture.debugElement.queryAll(By.css('.ui-button'));
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    let clienteAux = new Cliente();
    clienteAux.id_persona = '1';
    clienteAux.cuil = '123';
    clienteAux.fechaNacimiento = '11/11/11';
    clienteAux.genero = 'M';
    clienteAux.perfil_biometrico = true;
    clienteAux.nombre = 'Carlos';
    clienteAux.apellido = 'Tester';
    clienteAux.numero_documento = '41144114';
    clienteAux.pais_documento = '1';
    clienteAux.tipo_documento = 'dni';
    clienteAux.tipoSimboloDocumento = '1';
    clienteAux.pais_documento_descripcion = 'Argentina';
    clienteAux.problemas_enrolamiento = false;
    clienteAux.telefonos = [tel, tel, tel];
    clienteAux.domicilios = [dom, dom, dom];
    clienteAux.emails = [];
    clienteAux.generoDesc = 'Masculino';
    let personaRecinto: PersonaRecinto[] = [];
    let persona1 = new PersonaRecinto();
    persona1.documento = new Documento();
    persona1.documento.numero = clienteAux.numero_documento;
    persona1.nombreApellido = 'Carlos Tester';
    persona1.sucursal = '1';
    persona1.fecha = '11/11/11';
    persona1.tipoIdentificacion =  '1';
    persona1.nroCaja = '1';
    persona1.tipoAcceso = '1';
    persona1.cuenta = '1';
    component.currentCliente = clienteAux;
    personaRecinto.push(persona1);
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
    component.cajasSeleccionadas = cajasCliente;
    fixture.detectChanges();
    let servicioCajasTest = TestBed.inject(CajaseguridadService);
    let spyobtenerPersonasRecinto = spyOn(servicioCajasTest, 'obtenerPersonasRecinto').and.returnValue(of(personaRecinto));
    
    let errorServiceTest = TestBed.inject(ErrorService);
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY
    });
    
    boton[2].nativeElement.click();
    expect(spyobtenerPersonasRecinto).toHaveBeenCalled();
    expect(spysetError).toHaveBeenCalled();
  })

  it('abrirEstadoRecinto() -> ELSE', ()=>{
    let boton = fixture.debugElement.queryAll(By.css('.ui-button'));
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    let clienteAux = new Cliente();
    clienteAux.id_persona = '1';
    clienteAux.cuil = '123';
    clienteAux.fechaNacimiento = '11/11/11';
    clienteAux.genero = 'M';
    clienteAux.perfil_biometrico = true;
    clienteAux.nombre = 'Carlos';
    clienteAux.apellido = 'Tester';
    clienteAux.numero_documento = '41144114';
    clienteAux.pais_documento = '1';
    clienteAux.tipo_documento = 'dni';
    clienteAux.tipoSimboloDocumento = '1';
    clienteAux.pais_documento_descripcion = 'Argentina';
    clienteAux.problemas_enrolamiento = false;
    clienteAux.telefonos = [tel, tel, tel];
    clienteAux.domicilios = [dom, dom, dom];
    clienteAux.emails = [];
    clienteAux.generoDesc = 'Masculino';
    let personaRecinto: PersonaRecinto[] = [];
    let persona1 = new PersonaRecinto();
    persona1.documento = new Documento();
    persona1.documento.numero = '12311231';
    persona1.nombreApellido = 'Carlos Tester';
    persona1.sucursal = '1';
    persona1.fecha = '11/11/11';
    persona1.tipoIdentificacion =  '1';
    persona1.nroCaja = '1';
    persona1.tipoAcceso = '1';
    persona1.cuenta = '1';
    component.currentCliente = clienteAux;
    personaRecinto.push(persona1);
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
    cajasCliente.push(cajaCliente);
    cajasCliente.push(cajaCliente);
    component.cajasSeleccionadas = cajasCliente;
    fixture.detectChanges();
    let servicioCajasTest = TestBed.inject(CajaseguridadService);
    let spyobtenerPersonasRecinto = spyOn(servicioCajasTest, 'obtenerPersonasRecinto').and.returnValue(of(personaRecinto));
    
    let confirmationServiceTest = TestBed.inject(ConfirmationService);
    let spyconfirm = spyOn(confirmationServiceTest, 'confirm').and.callThrough();
    
    let spyinsertarClienteRecinto = spyOn(servicioCajasTest, 'insertarClienteRecinto').and.returnValue(of('200'));
    let spyauditarRecinto = spyOn(servicioCajasTest, 'auditarRecinto').and.returnValue(of('200'));
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spysetCurrentCliente = spyOn(consultasServiceTest, 'setCurrentCliente').and.callThrough();

    boton[2].nativeElement.click();
    expect(spyobtenerPersonasRecinto).toHaveBeenCalled();
    expect(spyconfirm).toHaveBeenCalled();
    // expect(spyinsertarClienteRecinto).toHaveBeenCalled();
    // expect(spyauditarRecinto).toHaveBeenCalled();
    // expect(spysetCurrentCliente).toHaveBeenCalled();
  })

  it('abrirEstadoRecinto() -> ELSE -> ELSE', ()=>{
    let boton = fixture.debugElement.queryAll(By.css('.ui-button'));
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    let clienteAux = new Cliente();
    clienteAux.id_persona = '1';
    clienteAux.cuil = '123';
    clienteAux.fechaNacimiento = '11/11/11';
    clienteAux.genero = 'M';
    clienteAux.perfil_biometrico = true;
    clienteAux.nombre = 'Carlos';
    clienteAux.apellido = 'Tester';
    clienteAux.numero_documento = '41144114';
    clienteAux.pais_documento = '1';
    clienteAux.tipo_documento = 'dni';
    clienteAux.tipoSimboloDocumento = '1';
    clienteAux.pais_documento_descripcion = 'Argentina';
    clienteAux.problemas_enrolamiento = false;
    clienteAux.telefonos = [tel, tel, tel];
    clienteAux.domicilios = [dom, dom, dom];
    clienteAux.emails = [];
    clienteAux.generoDesc = 'Masculino';
    let personaRecinto: PersonaRecinto[] = [];
    let persona1 = new PersonaRecinto();
    persona1.documento = new Documento();
    persona1.documento.numero = '12311231';
    persona1.nombreApellido = 'Carlos Tester';
    persona1.sucursal = '1';
    persona1.fecha = '11/11/11';
    persona1.tipoIdentificacion =  '1';
    persona1.nroCaja = '1';
    persona1.tipoAcceso = '1';
    persona1.cuenta = '1';
    component.currentCliente = clienteAux;
    personaRecinto.push(persona1);
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
    component.cajasSeleccionadas = cajasCliente;
    fixture.detectChanges();
    
    let servicioCajasTest = TestBed.inject(CajaseguridadService);
    let spyobtenerPersonasRecinto = spyOn(servicioCajasTest, 'obtenerPersonasRecinto').and.returnValue(of(personaRecinto));
    let spyinsertarClienteRecinto = spyOn(servicioCajasTest, 'insertarClienteRecinto').and.returnValue(of('200'));
    let spyauditarRecinto = spyOn(servicioCajasTest, 'auditarRecinto').and.returnValue(of('200'));

    let ConsultasServiceTest = TestBed.inject(ConsultasService);
    let spysetCurrentCliente = spyOn(ConsultasServiceTest, 'setCurrentCliente').and.callThrough();


    boton[2].nativeElement.click();
    expect(spyobtenerPersonasRecinto).toHaveBeenCalled();
  })

  it('abrirEstadoRecinto() -> servicioCajas.insertarClienteRecinto() -> ERROR', ()=>{
    let boton = fixture.debugElement.queryAll(By.css('.ui-button'));
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    let clienteAux = new Cliente();
    clienteAux.id_persona = '1';
    clienteAux.cuil = '123';
    clienteAux.fechaNacimiento = '11/11/11';
    clienteAux.genero = 'M';
    clienteAux.perfil_biometrico = true;
    clienteAux.nombre = 'Carlos';
    clienteAux.apellido = 'Tester';
    clienteAux.numero_documento = '41144114';
    clienteAux.pais_documento = '1';
    clienteAux.tipo_documento = 'dni';
    clienteAux.tipoSimboloDocumento = '1';
    clienteAux.pais_documento_descripcion = 'Argentina';
    clienteAux.problemas_enrolamiento = false;
    clienteAux.telefonos = [tel, tel, tel];
    clienteAux.domicilios = [dom, dom, dom];
    clienteAux.emails = [];
    clienteAux.generoDesc = 'Masculino';
    let personaRecinto: PersonaRecinto[] = [];
    let persona1 = new PersonaRecinto();
    persona1.documento = new Documento();
    persona1.documento.numero = '12311231';
    persona1.nombreApellido = 'Carlos Tester';
    persona1.sucursal = '1';
    persona1.fecha = '11/11/11';
    persona1.tipoIdentificacion =  '1';
    persona1.nroCaja = '1';
    persona1.tipoAcceso = '1';
    persona1.cuenta = '1';
    component.currentCliente = clienteAux;
    personaRecinto.push(persona1);
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
    component.cajasSeleccionadas = cajasCliente;
    fixture.detectChanges();
    
    let servicioCajasTest = TestBed.inject(CajaseguridadService);
    let spyobtenerPersonasRecinto = spyOn(servicioCajasTest, 'obtenerPersonasRecinto').and.returnValue(of(personaRecinto));
    let spyinsertarClienteRecinto = spyOn(servicioCajasTest, 'insertarClienteRecinto').and.returnValue(throwError(new Error('','','','')));

    boton[2].nativeElement.click();
    expect(spyobtenerPersonasRecinto).toHaveBeenCalled();
  })

  it('abrirEstadoRecinto() -> servicioCajas.auditarRecinto() -> ERROR', ()=>{
    let boton = fixture.debugElement.queryAll(By.css('.ui-button'));
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
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
    let clienteAux = new Cliente();
    clienteAux.id_persona = '1';
    clienteAux.cuil = '123';
    clienteAux.fechaNacimiento = '11/11/11';
    clienteAux.genero = 'M';
    clienteAux.perfil_biometrico = true;
    clienteAux.nombre = 'Carlos';
    clienteAux.apellido = 'Tester';
    clienteAux.numero_documento = '41144114';
    clienteAux.pais_documento = '1';
    clienteAux.tipo_documento = 'dni';
    clienteAux.tipoSimboloDocumento = '1';
    clienteAux.pais_documento_descripcion = 'Argentina';
    clienteAux.problemas_enrolamiento = false;
    clienteAux.telefonos = [tel, tel, tel];
    clienteAux.domicilios = [dom, dom, dom];
    clienteAux.emails = [];
    clienteAux.generoDesc = 'Masculino';
    let personaRecinto: PersonaRecinto[] = [];
    let persona1 = new PersonaRecinto();
    persona1.documento = new Documento();
    persona1.documento.numero = '12311231';
    persona1.nombreApellido = 'Carlos Tester';
    persona1.sucursal = '1';
    persona1.fecha = '11/11/11';
    persona1.tipoIdentificacion =  '1';
    persona1.nroCaja = '1';
    persona1.tipoAcceso = '1';
    persona1.cuenta = '1';
    component.currentCliente = clienteAux;
    personaRecinto.push(persona1);
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
    component.cajasSeleccionadas = cajasCliente;
    fixture.detectChanges();
    
    let servicioCajasTest = TestBed.inject(CajaseguridadService);
    let spyobtenerPersonasRecinto = spyOn(servicioCajasTest, 'obtenerPersonasRecinto').and.returnValue(of(personaRecinto));
    let spyinsertarClienteRecinto = spyOn(servicioCajasTest, 'insertarClienteRecinto').and.returnValue(of('200'));
    let spyauditarRecinto = spyOn(servicioCajasTest, 'auditarRecinto').and.returnValue(throwError(new Error('', '', '', '')));

    boton[2].nativeElement.click();
    expect(spyobtenerPersonasRecinto).toHaveBeenCalled();
  })

  it('addOrRemoveRow()', () => {
    let event = {
      checked: true
    }
    let caja = new Caja();
    caja.empresa, caja.sucursal, caja.cuenta, caja.nroCajaSeguridad, caja.maxCorrelativo, caja.sucursalDescripcion, caja.modeloCaja, caja.estado, caja.estado, caja.frecuenciaMes, caja.frecuenciaDescripcion, caja.novedades, caja.tipoAcceso, caja.titularidad, caja.idCaja = 'test';

    component.addOrRemoveRow(caja, event);

    expect(component.cajasSeleccionadas).toContain(caja);

  })

   it('addOrRemoveRow() -> ELSE', () => {
    let event = {
      checked: false
    }
    let caja = new Caja();
    caja.empresa, caja.sucursal, caja.cuenta, caja.nroCajaSeguridad, caja.maxCorrelativo, caja.sucursalDescripcion, caja.modeloCaja, caja.estado, caja.estado, caja.frecuenciaMes, caja.frecuenciaDescripcion, caja.novedades, caja.tipoAcceso, caja.titularidad, caja.idCaja = 'test';
    
    component.addOrRemoveRow(caja, event);

    expect(component.cajasSeleccionadas).not.toContain(caja);

  })
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
