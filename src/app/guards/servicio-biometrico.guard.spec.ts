import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../services/error.service';
import { HuellaService } from '../services/HttpServices/huella.service';

import { ServicioBiometricoGuard } from './servicio-biometrico.guard';

xdescribe('ServicioBiometricoGuard', () => {
  let guard: ServicioBiometricoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      //Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      providers: [HuellaService, ErrorService, MessageService],
      imports: [HttpClientTestingModule]
    });
    guard = TestBed.inject(ServicioBiometricoGuard);
  });

  it('Deberia crearse una instancia', () => {
    expect(guard).toBeTruthy();
  });
});
