import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginService } from 'src/app/services/HttpServices/login.service';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorService } from '../services/error.service';
import { MessageService } from 'primeng/api';
import { HuellaService } from '../services/HttpServices/huella.service';
import { WebsocketService } from '../services/websocket.service';
import { EnvService } from '../env.service';
import { EMPTY, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { doesNotReject } from 'assert';
import { Auditoria } from '../DTO/Auditoria';
import { NavUser } from '../DTO/nav-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { XfsApiService } from '../services/huella/xfs-api.service';

class FakeActivatedRoute{

}

class FakeRouter{
  navigate(arr:string[]){
    console.log('LLEGASTE HASTA EL FINAL', arr);
  }
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      //Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ LoginComponent ],
      providers: [LoginService, Router, ErrorService, MessageService,WebsocketService, HuellaService, EnvService,
        //Si un provider es una clase de Angular, se usa un FakeClass
        {provide: ActivatedRoute, useClass: FakeActivatedRoute},
        {provide: Router, useClass: FakeRouter} ],
        imports: [HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])]
      })
      .compileComponents();
    }));
    
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
    
  it('Deberia crear una instancia', () => {
    const huellaService = TestBed.inject(HuellaService);
    const servicioLogin = TestBed.inject(LoginService);
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    const spyHuella = spyOn(huellaService, 'cancelarEscaneo').and.callFake(()=>{
        return EMPTY;
      })
    let resp = new NavUser('test','test');
    const spyLogin = spyOn(servicioLogin, 'getNavUser').and.returnValue(of(resp));

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
    expect(spyHuella).toHaveBeenCalled();
    expect(spyLogin).toHaveBeenCalled();


  });

  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(BIOMETRIA)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'BIOMETRIA'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.callFake(()=>{
      return EMPTY;
    });
    boton.nativeElement.click();          
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();

  });

  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(ENROLADOR_RRHH)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'ENROLADOR_RRHH'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.returnValue(of(new Auditoria()));
    boton.nativeElement.click();      
    console.log('USUARIO',component.usuario);
    console.log('PASSW',component.password);
    console.log('BOTON',boton);
    
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();
  });

  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(CAJA_SEGURIDAD)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'CAJA_SEGURIDAD'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.returnValue(of(new Auditoria()));
    boton.nativeElement.click();      
    console.log('USUARIO',component.usuario);
    console.log('PASSW',component.password);
    console.log('BOTON',boton);
    
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();
  });

  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(CAJA_SEGURIDAD_RRHH)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'CAJA_SEGURIDAD_RRHH'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.returnValue(of(new Auditoria()));
    boton.nativeElement.click();      
    console.log('USUARIO',component.usuario);
    console.log('PASSW',component.password);
    console.log('BOTON',boton);
    
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();
  });

  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(REPORTE)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'REPORTE'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.returnValue(of(new Auditoria()));
    boton.nativeElement.click();      
    console.log('USUARIO',component.usuario);
    console.log('PASSW',component.password);
    console.log('BOTON',boton);
    
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();
  });
  it('loguearse() -> IF -> SUCCESS -> saltarAPagina(BAJA_HUELLA)', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'BAJA_HUELLA'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    const servicioLogin = TestBed.inject(LoginService);
    const espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(of(fakeUsuario));
    const espiaAuditoria = spyOn(servicioLogin, 'addAuditoriaAcceso').and.returnValue(of(new Auditoria()));
    boton.nativeElement.click();      
    console.log('USUARIO',component.usuario);
    console.log('PASSW',component.password);
    console.log('BOTON',boton);
    
    
    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(espiaAuditoria).toHaveBeenCalled();
  });

  it('loguearse() -> IF -> ERROR', ()=>{
    
    //Creo objeto fake para mockear un logIn al sistema
    let fakeUsuario = {
      usuario: 'MB70118',
      password: 'uex.7876',
      perfil: 'BIOMETRIA'
    }
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = 'MB70118';
    component.password = 'uex.7876';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css ('button'));


    //Creo servicios que van a ser llamadados
    let servicioLogin = TestBed.inject(LoginService);
    let error = {
      status: 403
    };
    let espiaLogIn = spyOn(servicioLogin, 'loguearUsuario').and.returnValue(throwError(error));
    boton.nativeElement.click();

    //Espero que los servicios se hayan ejecutado
    expect(espiaLogIn).toHaveBeenCalled();
    expect(component.usuarioFalloVerificar).toEqual('MB70118');
    expect(component.passFalloVerificar).toEqual('uex.7876');
    expect(component.displayPopUpSesionActiva).toEqual(true);
    expect(component.password).toEqual('');
  });

  it('loguearse() -> ERROR', () => {
    
    //Le asigno valores a las variables de clase y busco el boton
    component.usuario = '';
    component.password = '';
    component.isLogged = false;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css('button'));


    //Creo servicios que van a ser llamadados
    let error = {
      status: 403
    };
    let errorServiceTest = TestBed.inject(ErrorService);
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });

    //CLICK
    boton.nativeElement.click();
    
    //Espero que los servicios se hayan ejecutado
    expect(spysetError).toHaveBeenCalled();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
