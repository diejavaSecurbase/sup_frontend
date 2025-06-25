import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteIngresosComponent } from './reporte-ingresos.component';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ErrorService } from '../services/error.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { Reporte } from '../reporte-detalle/reporte';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { EnvService } from '../env.service';

import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { mockReporteIngreso } from '../mocks/reporteIngresos';

describe('ReporteIngresosComponent', () => {
  let component: ReporteIngresosComponent;
  let fixture: ComponentFixture<ReporteIngresosComponent>;
  let cajaSeguridadServiceSpy: jasmine.SpyObj<CajaseguridadService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let datePipeSpy: jasmine.SpyObj<DatePipe>;
  let consultasServiceTest:jasmine.SpyObj<ConsultasService>;
  let loginServiceTest: jasmine.SpyObj<LoginService>;

  beforeEach(async(async () => {
    cajaSeguridadServiceSpy = jasmine.createSpyObj('CajaseguridadService', ['getReporteIngresos']);
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['setMessage', 'procesarRespuestaError']);
    datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform']);
    consultasServiceTest= jasmine.createSpyObj('ConsultasService', ['getTiposDocs', 'getPaises']);
    loginServiceTest= jasmine.createSpyObj('LoginService', ['getSucursal']);

    await TestBed.configureTestingModule({
      declarations: [ReporteIngresosComponent],
      providers: [
        ConsultasService,
        ErrorService,
        LoginService,
        HttpClient,
        EnvService,
        MessageService,
        { provide: ErrorService, useValue: errorServiceSpy },
        {provide: CajaseguridadService, useValue: cajaSeguridadServiceSpy},
        { provide: DatePipe, useValue: datePipeSpy },
        { provide: ConsultasService, useValue: consultasServiceTest },
        { provide: LoginService, useValue: loginServiceTest },        
        Reporte,
        IdentificacionCliente,
      ],
      imports: [
        HttpClientTestingModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule, 
        CalendarModule, 
        TableModule,
        ButtonModule, 
        RouterTestingModule.withRoutes([]),
        DropdownModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {    
    fixture = TestBed.createComponent(ReporteIngresosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should format dates correctly and fetch report', () => {
    component.fechaDesde = new Date('2024-01-01');
    component.fechaHasta = new Date('2024-02-01');
    
    cajaSeguridadServiceSpy.getReporteIngresos.and.returnValue(of(mockReporteIngreso));
    
    component.buscar();
    expect(component.ingresos.length).toBe(1);
    expect(component.ingresos[0].numeroDocumento).toBe('12345678');
    expect(component.ingresos[0].tipoIdentificacion).toBe('Identificacion');
  });

  it('should handle date errors', () => {
    component.fechaDesde = new Date('2024-02-01');
    component.fechaHasta = new Date('2024-01-01');
    component.buscar();
    expect(errorServiceSpy.setMessage).toHaveBeenCalledWith('warn', 'Portal de Clientes', 'La fecha hasta no puede ser menor que la fecha desde');
  });

  it('should handle API errors', () => {
    component.fechaDesde = new Date('2024-01-01');
    component.fechaHasta = new Date('2024-02-01');
    cajaSeguridadServiceSpy.getReporteIngresos.and.returnValue(throwError('Error en la API'));
    
    component.buscar();
    expect(errorServiceSpy.procesarRespuestaError).toHaveBeenCalled();
  });

  it('should reset filters correctly', () => {
    component.fechaDesde = new Date();
    component.fechaHasta = new Date();
    component.nroCaja = '123';
    component.limpiarFiltros();
    expect(component.fechaDesde).toBeNull();
    expect(component.fechaHasta).toBeNull();
    expect(component.nroCaja).toBeNull();
    expect(component.pais).toBe('80');
  });
  it('should set isLoading to false and detalles to null when buscarAgain is called', () => {
    component.buscarAgain();
    expect(component.isLoading).toBeFalse();
    expect(component.ingresos).toBeNull();
  });

});
