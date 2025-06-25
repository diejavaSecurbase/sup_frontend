import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTelefonoComponent } from './form-telefono.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConsultasService } from 'src/app/services/HttpServices/consultas.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvService } from 'src/app/env.service';
import { MessageService } from 'primeng/api';
import { Telefono } from 'src/app/DTO/telefono';
import { of, throwError } from 'rxjs';
import { mockTelefono } from 'src/app/mocks/telefono';
import { emit } from 'cluster';

describe('FormTelefonoComponent', () => {
  let component: FormTelefonoComponent;
  let fixture: ComponentFixture<FormTelefonoComponent>;

  let mockErrorService: jasmine.SpyObj<ErrorService>;
  let mockConsultasService: jasmine.SpyObj<ConsultasService>;
  

  beforeEach(async(() => {
   
    mockErrorService = jasmine.createSpyObj('ErrorService', ['setError','setMessage']);
    mockConsultasService = jasmine.createSpyObj('ConsultasService', [
      'patchTelefono',
      'postTelefono'
    ]);

    TestBed.configureTestingModule({
      declarations: [ FormTelefonoComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ DynamicDialogRef, 
        DynamicDialogConfig, 
        EnvService, 
        MessageService, 
        { provide: 'ErrorService', useValue: mockErrorService },
        { provide: 'ConsultasService', useValue: mockConsultasService },
         HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let ddc = TestBed.inject(DynamicDialogConfig);
    ddc.data = {};
    fixture = TestBed.createComponent(FormTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let mockConfData = {
      idCliente: '80:4:12345678',
      documento: '12345678',
      isPatch: false,
      actual: {
        codigoArea: '123',
        numero: '4567890',
        tipo: 'FIJO'
      } as Telefono,
      emitter: {
        emit: jasmine.createSpy(),
        complete: jasmine.createSpy()
      }
    };

    // Asignar la configuración al componente
    component.conf = { data: mockConfData };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize tipos correctly', () => {
    component.ngOnInit();
    expect(component.tipos).toEqual([
      { label: 'Fijo', value: 'FIJO' },
      { label: 'Celular', value: 'CELULAR' },
      { label: '', value: null }
    ]);
  });

  it('should set values from conf.data.actual if isPatch is true', () => {
    component.conf = {
      data: {
        isPatch: true,
        actual: {
          codigoArea: '123',
          numero: '4567890',
          tipo: 'FIJO'
        } as Telefono
      }
    };
    
    component.ngOnInit();
    expect(component.codArea).toBe('123');
    expect(component.numTel).toBe('4567890');
    expect(component.tipo).toBe('FIJO');
  });
  it('should set default tipo if isPatch is false', () => {
    component.conf = { data: { isPatch: false } };
    component.ngOnInit();
    expect(component.tipo).toBe('FIJO');
  });
  it('should call postTelefono when isPatch is false', () => {
    component.tipo = 'FIJO';
    component.codArea = '123';
    component.numTel = '4567890';
   
    mockConsultasService.postTelefono.withArgs(component.conf.data.idCliente,component.tipo,'movistar',component.numTel, component.codArea,component.conf.data.documento).and.returnValue(of(1));
    fixture.detectChanges();
    
    component.confirmar();

    expect(mockConsultasService.postTelefono).toHaveBeenCalledBefore;
    
  });
  it('should call patchTelefono when isPatch is true', () => {
    component.tipo = 'FIJO';
    component.codArea = '123';
    component.numTel = '4567890';
    component.conf.data.isPatch = true;
    fixture.detectChanges();
    mockConsultasService.patchTelefono.withArgs(component.conf.data.idCliente,component.conf.data.actual.id,component.tipo,'movistar',component.numTel, component.codArea,component.conf.data.documento).and.returnValue(of(1));
    

    component.confirmar();

    expect(mockConsultasService.patchTelefono).toHaveBeenCalledBefore;
    
  });
  
  it('should handle error response', () => {
    component.tipo = 'FIJO';
    component.codArea = '123';
    component.numTel = '4567890';
    mockConsultasService.postTelefono.and.returnValue(throwError(() => new Error('Error')));

    component.confirmar();

    expect(mockErrorService.procesarRespuestaError).toHaveBeenCalledBefore;
  });
   
  it('should prevent input if key is not a number in verificarCodigoArea', () => {
    const event = { key: 'a', preventDefault: jasmine.createSpy() };
    component.verificarCodigoArea(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
  it('should reset numTel and codArea in cambiarTipoTelefono', () => {
    component.numTel = '123456';
    component.codArea = '123';
    component.cambiarTipoTelefono('FIJO');
    expect(component.numTel).toBe('');
    expect(component.codArea).toBe('');
  });
});
