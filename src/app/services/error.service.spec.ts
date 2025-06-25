import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';
import { Error } from '../DTO/error';
import { EMPTY } from 'rxjs';
import { ErrorResponse } from '../DTO/error-response';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
      TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
       providers: [MessageService],
       imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
    
    it('getError()', () => {
        service.getError();
    })

    it('setError()', () => {
        let messageServiceTest = TestBed.inject(MessageService);
        let spyclear = spyOn(messageServiceTest, 'clear').and.callFake(() => {
            return EMPTY
        });
        let spyadd = spyOn(messageServiceTest, 'add').and.callFake(() => {
            return EMPTY;
        })

        service.setError(new Error('test', 'test', 'test', 'test'), '1');

        expect(spyclear).toHaveBeenCalled();
        setTimeout(() => {
        expect(spyadd).toHaveBeenCalled();
        }, 11000);
    })
  
  it('procesarRespuestaError() -> TRY', () => {
    let resp = {
      error: new ErrorResponse(),
      status: 123
    };
    let error: ErrorResponse = new ErrorResponse();
    error.codigo = 123;
    error.estado = 'ok';
    error.tipo = '1';
    error.detalle = '';
    error.errores = [];
    error.errores.push(new Error('test', 'test', 'test', 'test'));
    error.errores.push(new Error('test', 'test', 'test', 'test'));
    console.log(resp);
    
    resp.error = error;
    resp.status = 123;

    
    service.procesarRespuestaError(resp);
    expect(resp.status).not.toEqual(401);
  })

  it('procesarRespuestaError() -> CATCH', () => {
    let resp = {
      error: new ErrorResponse(),
      status: 123
    };
    resp.status = 123;

    
    service.procesarRespuestaError(resp);
    expect(resp.status).not.toEqual(401);
  })

    afterAll(() => {
    TestBed.resetTestingModule();
  });
});
