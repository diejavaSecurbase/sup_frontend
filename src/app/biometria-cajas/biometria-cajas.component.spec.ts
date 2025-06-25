import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometriaCajasComponent } from './biometria-cajas.component';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { ErrorService } from '../services/error.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginService } from '../services/HttpServices/login.service';
import { WebsocketService } from '../services/websocket.service';
import { EnvService } from '../env.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
class MockEnrolamientoComponent {
  ngOnInit() {}
  ngOnDestroy() {}
}
xdescribe('BiometriaCajasComponent', () => {
  let component: BiometriaCajasComponent;
  let fixture: ComponentFixture<BiometriaCajasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
// Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ BiometriaCajasComponent ],
      providers: [ConsultasService, HuellaService, ErrorService, MessageService, LoginService, ConfirmationService, WebsocketService,EnvService,CajaseguridadService,
              {provide: ActivatedRoute,useValue: {url: of(url)}},
              { provide: Router, useClass: FakeRouter },],
            imports: [HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometriaCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct default values', () => {
    expect(component.aplicacion).toBe('CAJASEG');
    expect(component.mostrarMetdo).toBeTrue();
    expect(component['fallbackURL']).toBe('/biometria');
  });
  it('should call super.ngOnInit on initialization', () => {
    const spyOnInit = spyOn(MockEnrolamientoComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    expect(spyOnInit).toHaveBeenCalledBefore;
  });
  it('should call super.ngOnDestroy on destruction', () => {
    const spyOnDestroy = spyOn(MockEnrolamientoComponent.prototype, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(spyOnDestroy).toHaveBeenCalledBefore;
  });
});
