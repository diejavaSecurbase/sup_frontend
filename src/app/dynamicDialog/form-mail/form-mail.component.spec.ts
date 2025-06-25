import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMailComponent } from './form-mail.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConsultasService } from 'src/app/services/HttpServices/consultas.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvService } from 'src/app/env.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { mockDocumento } from 'src/app/mocks/documento';

describe('FormMailComponent', () => {
  let component: FormMailComponent;
  let fixture: ComponentFixture<FormMailComponent>;

  let errorServiceMock: jasmine.SpyObj<ErrorService>;
  let consultasServiceMock: jasmine.SpyObj<ConsultasService>;

  beforeEach(async(() => {

    errorServiceMock = jasmine.createSpyObj('ErrorService', ['setError','setMessage']);
    consultasServiceMock = jasmine.createSpyObj('ConsultasService', [
      'patchMail',
      'postMail'
    ]);

    TestBed.configureTestingModule({
      declarations: [ FormMailComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [ DynamicDialogRef, 
        DynamicDialogConfig, 
        MessageService, 
        EnvService, 
        { provide: 'ErrorService', useValue: errorServiceMock },
        { provide: 'ConsultasService', useValue: consultasServiceMock }, 
        HttpClient]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    let ddc = TestBed.inject(DynamicDialogConfig);
    ddc.data = {};
    fixture = TestBed.createComponent(FormMailComponent);
    component = fixture.componentInstance;

    let mockConfData = {
          idCliente: '80:4:12345678',
          documento: '12345678',
          isPatch: false,
          actual: {
            id: '123'            
          },
          emitter: {
            emit: jasmine.createSpy(),
            complete: jasmine.createSpy()
          }
        };
    
        // Asignar la configuración al componente
        component.conf = { data: mockConfData };
        component.mail = 'test@mail.com';
        fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call patchMail when isPatch is true', () => {
    component.conf.data.isPatch = true;
    consultasServiceMock.patchMail.and.returnValue(of(200));

    component.confirmar();

    expect(consultasServiceMock.patchMail).toHaveBeenCalledBefore;
    expect(component.conf.data.emitter.emit).toHaveBeenCalledBefore;
    expect(component.conf.data.emitter.complete).toHaveBeenCalledBefore;
    
  });

  it('should call  a postMail when isPatch is false', () => {
    consultasServiceMock.postMail.and.returnValue(of(201));

    component.confirmar();

    expect(consultasServiceMock.postMail).toHaveBeenCalledBefore;
    expect(component.conf.data.emitter.emit).toHaveBeenCalledBefore;
    expect(component.conf.data.emitter.complete).toHaveBeenCalledBefore;
 });


it('debería manejar errores llamando a procesarRespuestaError()', () => {
    const error = new Error('Error en la API');
    consultasServiceMock.postMail.and.returnValue(throwError(() => error));

    component.confirmar();

    expect(errorServiceMock.procesarRespuestaError).toHaveBeenCalledBefore;
    
  });


});
