import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from  '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvService } from 'src/app/env.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { XfsApiService } from '../huella/xfs-api.service';
import { throwError } from 'rxjs';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let env: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LoginService, HttpClient, ErrorService, EnvService, MessageService]
    });
    env = TestBed.inject(EnvService);
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should loguear usuario', () => {
    let nuevoHuellasServiceTest = TestBed.inject(XfsApiService);
    const dummyReply = {
      perfil: 'BIOMETRIA',
      sucursal: '100',
      access_token: 'a.' + btoa('{"preferred_username": "jorgito", "session_state": "id", "exp": 10000}') + '.b',
      refresh_token: 'token_refresh',
      nombre: 'nombre usuario'
    }
    let spycancelarEscaneoNuevo = spyOn(nuevoHuellasServiceTest, 'cancelScanFingerprint').and.returnValue(throwError('someError'));
    service.loguearUsuario("username", "password").subscribe(success => {
      console.log(success);
      expect(spycancelarEscaneoNuevo).toHaveBeenCalled();
      expect(success).toEqual(dummyReply);

      expect(service.isTokenExpired()).toBeTrue();

      service.logout();
    })

    //Solo se puede tener un puerto activo en karma.conf.js (esta configurado el 9876, si se configura otro deja de andar el test de abajo)
    //const reqIpNuevo = httpMock.expectOne(environment.deviceServicesREST  + '/v1/local-devices/ip-address');
    //expect(reqIpNuevo.request.method).toBe("GET");
    //reqIpNuevo.flush("192.168.1.1");

    const reqIp = httpMock.expectOne(environment.servBiometrico + 'ip-address');
    expect(reqIp.request.method).toBe("GET");
    reqIp.flush("192.168.1.1");

    const req = httpMock.expectOne(env.apiUrl + LoginService.ENDPOINTS.getLogin);
    expect(req.request.method).toBe("POST");
    req.flush(dummyReply);

    const reqLogOut = httpMock.expectOne(env.apiUrl + LoginService.ENDPOINTS.eliminarSesion);
    expect(reqLogOut.request.method).toBe("POST");
    reqLogOut.flush("OK");
  })

  it('should obtener la llave de encriptacion', () => {
    const dummyEncryptionKeyReply = {
      token: 'asdasdaszxc1234234sadasdasd'
    }

    service.getEncryptionKey().subscribe(success => {
      expect(success).toEqual(dummyEncryptionKeyReply);
    })

    let req = httpMock.expectOne(env.apiUrl + LoginService.ENDPOINTS.getEncryptionKey);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEncryptionKeyReply);
  })
});
