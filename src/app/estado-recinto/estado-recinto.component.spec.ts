import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoRecintoComponent } from './estado-recinto.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../services/HttpServices/login.service';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../services/error.service';
import { EnvService } from '../env.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { PersonaRecinto } from '../DTO/PersonaRecinto';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service'

describe('EstadoRecintoComponent', () => {
  let component: EstadoRecintoComponent;
  let fixture: ComponentFixture<EstadoRecintoComponent>;
  let personasRecinto: BehaviorSubject<PersonaRecinto[]> = new BehaviorSubject<PersonaRecinto[]>(null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LoginService, HttpClient, ErrorService, EnvService, MessageService, ConfirmationService, CajaseguridadService],
      declarations: [ EstadoRecintoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let logService = TestBed.inject(LoginService);
    spyOn(logService, 'getSucursal').and.returnValue(new Observable(obs => {
      obs.next('213');
    }));
    let cajasService = TestBed.inject(CajaseguridadService);
    spyOn(cajasService, 'getPersonasRecintoObservable').and.returnValue(personasRecinto);

    fixture = TestBed.createComponent(EstadoRecintoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse una instancia', () => {
    expect(component).toBeTruthy();
    expect(component.sucursal).toEqual('213');
  });



  it('should reaccionar a un cambio en recinto', () => {
    let metodoAEspiar = spyOn(component, 'cargarDatosGrilla');
    let personaRecinto: PersonaRecinto[] = [{cuenta: 'cuenta', documento: {numero: 'num', pais: 'pais', tipo: 'tipo'}, fecha: 'fecha', nombreApellido: 'jorgito', nroCaja: '2', sucursal: '213', tipoAcceso: 'a', tipoIdentificacion: 'i'}];
    personasRecinto.next(personaRecinto);
    expect(metodoAEspiar).toHaveBeenCalled();

    setTimeout(() => {

      let caja = component.estadosRecinto[0];
      component.salir(caja);
  
      expect(component.estadosRecinto.length).toBe(0);
    }, 1000);
  })


});
