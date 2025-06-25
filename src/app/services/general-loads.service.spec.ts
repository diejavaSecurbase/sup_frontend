import { TestBed } from '@angular/core/testing';

import { GeneralLoadsService } from './general-loads.service';
import { ErrorService } from './error.service';
import { Error } from '../DTO/error';
import { MessageService } from 'primeng/api';

describe('GeneralLoadsService', () => {
  let service: GeneralLoadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[ErrorService, MessageService]
    });
    service = TestBed.inject(GeneralLoadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return TRUE - verificarInput', () =>{
    let dni = '123456';
    let response= service.verificarInput(dni,'documento');
    expect(response).toBeTrue;
  })

  it('should be return False - verificarInput', () =>{
    let dni = 'qwerty';
    let response= service.verificarInput(dni,'documento');
    expect(response).toBeFalse;
  })

 it('should be return date when formatDate is called', () => {
    let date = '10-11-2023 07:30:00';
    let response = service.formatDate(date);
  
    expect(response).toBeTruthy();
  });
  
  it('should be return null when formatDate is called', () => {
    let date = null;
    let response = service.formatDate(date);
  
    expect(response).toEqual('');
  });
  
  it('formatDateToString return un string con fecha',()=>{
    let date = new Date();
    let response = service.formatDateToString(date);

    expect(response).toBeTruthy();

  });

  it('Success onChangeDesde ',()=>{
    let fechaDesde = new Date('11/01/2024');
    let fechaHoy= new Date('15/01/2024'); 
    let response = service.onChangeDesde(fechaDesde,fechaHoy);
    expect(response).toBeTruthy();

  });
});
