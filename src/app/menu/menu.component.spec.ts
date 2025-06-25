import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { Cliente } from '../DTO/cliente';
import { Domicilio } from '../DTO/domicilio';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Telefono } from '../DTO/telefono';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { LoginService } from '../services/HttpServices/login.service';
import { WebsocketService } from '../services/websocket.service';

import { MenuComponent } from './menu.component';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [MenuComponent],
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
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Se deberia crear una instancia', () => {
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let loginServiceTest = TestBed.inject(LoginService);
    let cliente = new Cliente();
    let string: string[] = ['test', 'test', 'test', 'test', 'test', 'test'];
    cliente.id_persona = 'test';
    cliente.cuil = 'test';
    cliente.fechaNacimiento = 'test';
    cliente.genero = 'test';
    cliente.perfil_biometrico = true;
    cliente.nombre = 'test';
    cliente.apellido = 'test';
    cliente.numero_documento = '41144114';
    cliente.pais_documento = 'test';
    cliente.tipo_documento = 'test';
    cliente.tipoSimboloDocumento = 'test';
    cliente.pais_documento_descripcion = 'test';
    cliente.problemas_enrolamiento = false;
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
    cliente.telefonos = [];
    cliente.domicilios = [];
    cliente.telefonos.push(tel);
    cliente.domicilios.push(dom);
    cliente.es_empleado = true;
    cliente.generoDesc = 'test';
    let spygetCurrentClienteObservable = spyOn(consultasServiceTest, 'getCurrentClienteObservable').and.returnValue(of(cliente));

    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    let spygetCurrentIdObservable = spyOn(consultasServiceTest, 'getCurrentIdObservable').and.returnValue(of(idCliente));

    let menu = ['test', 'test', 'test', 'test', 'test', 'test', 'test',];
    let spygetFuncionesObservable = spyOn(loginServiceTest, 'getFuncionesObservable').and.callFake(() => of(menu));
    
    component.ngOnInit();
    
    expect(component).toBeTruthy();
    expect(spygetCurrentClienteObservable).toBeTruthy();
    expect(spygetCurrentIdObservable).toBeTruthy();
    expect(spygetFuncionesObservable).toBeTruthy();
    expect(component.currentCliente).toEqual(cliente);
    expect(component.currentId).toEqual(idCliente);
    expect(component.menu).toEqual(menu);
  });

  it('toggleMenu() -> IF', () => {
    component.esEmbebido = false;
    component.menu = [];
    component.menuStatus.closed = true;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css('#menu > div')).nativeElement;
    

    boton.click();

    expect(component.menuStatus.closed).toEqual(false);
    expect(component.menuStatus.closing).toEqual(false);
    expect(component.menuStatus.opening).toEqual(true);
    expect(component.menuStatus.opened).toEqual(true);
    
  })

    it('toggleMenu() -> ELSE', () => {
    component.esEmbebido = false;
    component.menu = [];
    component.menuStatus.closed = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css('#menu > div')).nativeElement;
    

    boton.click();

    expect(component.menuStatus.closed).toEqual(true);
    expect(component.menuStatus.closing).toEqual(true);
    expect(component.menuStatus.opening).toEqual(false);
    expect(component.menuStatus.opened).toEqual(false);
    
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
