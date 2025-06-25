import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { LoginService } from './login.service';
const CryptoJS = require('crypto-js');
import { SelectControlValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static ENDPOINTS = {
    verificarSesion: '/sesion/v2.0/verificarSesion',
    eliminarSesion: '/sesion/v2.0/eliminarSesion',
    eliminarSesionPorUser: '/sesion/v2.0/eliminarSesionUser',
    verificarSesionConId: '/sesion/v2.0/verificarSesionConId',
  };



  constructor(public http: HttpClient, public env: EnvService) {}


}
