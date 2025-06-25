import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { LoginService } from '../services/HttpServices/login.service';
import { WebsocketService } from '../services/websocket.service';
import { MenuHorizontalComponent } from './menu-horizontal.component';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('MenuHorizontalComponent', () => {
  let component: MenuHorizontalComponent;
  let fixture: ComponentFixture<MenuHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [MenuHorizontalComponent],
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
    fixture = TestBed.createComponent(MenuHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse una instancia', () => {
    let loginServiceTest = TestBed.inject(LoginService);
    let menu = ['test', 'test', 'test', 'test', 'test', 'test', 'test',];
    let spygetFuncionesObservable = spyOn(loginServiceTest, 'getFuncionesObservable').and.returnValue(of(menu));

    
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.menu.length).toEqual(7);
    expect(component.items.length).toEqual(11);
  });

});
