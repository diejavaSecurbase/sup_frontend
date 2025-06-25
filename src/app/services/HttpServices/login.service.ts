import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, observable, throwError } from 'rxjs';
import { User } from 'src/app/DTO/User';
import { Router, ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/env.service';
import { Menu } from 'src/app/DTO/Menu';
import { NavUser } from 'src/app/DTO/nav-user';
import { ErrorService } from '../error.service';
import { Error } from 'src/app/DTO/error';
import { ErrorResponse } from 'src/app/DTO/error-response';
import { Auditoria } from 'src/app/DTO/Auditoria';
import { stringify } from 'querystring';
const CryptoJS = require('crypto-js');
import { environment } from 'src/environments/environment';
import { XfsApiService } from '../huella/xfs-api.service';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public static ENDPOINTS = {
    getLogin : '/usuarios/v2.0/acceso',
    getFunciones: '/usuarios/v2.0/funciones',
    refreshToken: '/usuarios/v2.0/acceso/refrescar',
    auditarIngreso: '/usuarios/v2.0/ingreso',
    auditarEgreso: '/usuarios/v2.0/egreso',
    eliminarSesion: '/sesion/v2.0/eliminarSesion',
    eliminarSesionPorUser: '/sesion/v2.0/eliminarSesionUser',
    getEncryptionKey: '/usuarios/v2.0/encryptionKey'
  };

  private currentTimeOut: NodeJS.Timeout = null;
  private userNav: BehaviorSubject<NavUser> = new BehaviorSubject(new NavUser(null, null));
  private sucursal: BehaviorSubject<string> = new BehaviorSubject(null);
  private funciones: string[] = null;
  private funcionesObservable: BehaviorSubject<string[]> = new BehaviorSubject(null);


  constructor(public http: HttpClient,
              public router: Router,
              public env: EnvService, 
              private errorService: ErrorService,
              private xfsService : XfsApiService) {
   }


  //Hardcode acceso
  private mockearAcceso = true;

  
  private loggedInUserSubject: BehaviorSubject<User>;
  private jwtToken: string;
  private jwtRefreshToken: string;
  public loggedInUser: Observable <User>;
  username: string;
  private currentIp: string = null;

  public setLoggedUser(loggedUser: User): void {
    this.loggedInUserSubject.next(loggedUser);
  }

  public getLoggedUser(): User {
      return this.loggedInUserSubject.value;
  }

  public getRefreshToken():string{
    return this.jwtRefreshToken;
  }

  public setToken(token: string, refreshToken: string){
    this.jwtToken = token;
    this.jwtRefreshToken = refreshToken;
    
    
    //TIMEOUT DE TOKEN
    /*
    const datosToken = JSON.parse(atob(this.jwtToken.split('.')[1]));
    const finToken = datosToken.exp * 1000;
    const tiempoRestante = finToken - new Date().getTime();
    if (this.currentTimeOut) {
      clearTimeout(this.currentTimeOut);
    }
    this.currentTimeOut = setTimeout(() => {
      this.logout(true);
      this.errorService.setError(new Error('Portal de clientes', 'Portal de Clientes', 'Se ha superado el tiempo máximo de inactividad. Por favor vuelva a ingresar', '0'));
    }, tiempoRestante);
    */
  }

  public getToken(): string{
    return this.jwtToken;
  }

  loguearUsuario(usuario: string, password: string): Observable<any> {
    this.username = usuario;
    const encrypted = CryptoJS.AES.encrypt(password, this.env.cryptokey);
    const body = {
      usuario,
      clave: encrypted.toString()
    };
    const acceso = new Observable(observer => {
      this.http.post<any>(this.env.apiUrl + LoginService.ENDPOINTS.getLogin, body).subscribe(success => {
        this.setToken(success.access_token, success.refresh_token);
        this.setSucursal(success.sucursal);
        const perfil = success.perfil;
        this.setUserPerfil(success.nombre, perfil);
        this.datosTemporalesDeUsuario(success.nombre, usuario, perfil);
        if(perfil == 'CAJA_SEGURIDAD_RRHH'){
          this.setFunciones([perfil, 'CAJA_SEGURIDAD', 'REPORTE']);
        }
        else if(perfil == 'ENROLADOR_RRHH'){
          this.setFunciones([perfil, 'BIOMETRIA']);
        }
        else if(perfil == 'CAJA_SEGURIDAD'){
          this.setFunciones([perfil, 'REPORTE']);
        }
        else{
          this.setFunciones([perfil]);
        }
        observer.next(success);
      }, failure => {
        if(failure.status != 403){
          this.errorService.procesarRespuestaError(failure);
        }
        observer.error(failure);
      });
    });
    return new Observable(observer => {
      this.xfsService.cancelScanFingerprint().subscribe(success => {
          this.http.get(environment.deviceServicesREST + '/v1/local-devices/ip-address', {responseType: 'text'}).subscribe(success => {
            this.currentIp = success.toString();
            acceso.subscribe(success => {
              observer.next(success);
            }, failure => {
              observer.error(failure);
            })
          }, error => {
            this.currentIp = "1.100.1.1";
            acceso.subscribe(success => {
              observer.next(success);
            }, failure => {
              observer.error(failure);
            })
          });
      }, error => {
          this.http.get(environment.servBiometrico + 'ip-address', {responseType: 'text'}).subscribe(success => {
            this.currentIp = success.toString();
            acceso.subscribe(success => {
              observer.next(success);
            }, failure => {
              observer.error(failure);
            })
          }, error => {
            this.currentIp = "1.100.1.1";
            acceso.subscribe(success => {
              observer.next(success);
            }, failure => {
              observer.error(failure);
            })
          });
        }
      )
    })
  }

  refreshToken(): Observable<any>{
    return this.http.post<any>(this.env.apiUrl + LoginService.ENDPOINTS.refreshToken, {refresh_token: this.jwtRefreshToken});
  }

  logout(timeout ?: boolean): boolean {
    let eliminar = this.eliminarSesion(timeout);
    if(eliminar != null){
      eliminar.subscribe(data => {
          this.jwtToken = null;
          this.setFunciones(null);
          this.setSucursal(null);
          this.userNav.next(new NavUser(null, null));
          sessionStorage.clear();
          this.router.navigate(['']);
      }, error => {
      });
      return true;
    }
    else{
      return false;
    }
  }

  obtenerFunciones(): string[] {
    return this.funciones;
  }

  setUserPerfil(user, perfil){
    this.userNav.next(new NavUser(user, perfil));
  }

  getNavUser(): Observable<NavUser>{
    return this.userNav;
  }

  private setFunciones(funciones: string[]){
    this.funciones = funciones;
    this.funcionesObservable.next(funciones);
  }

  public getFuncionesObservable(): Observable<string[]>{
    return this.funcionesObservable;
  }

  isTokenExpired(): boolean{
    if (this.jwtToken == null){
      return true;
    }
    const datosToken = JSON.parse(atob(this.jwtToken.split('.')[1]));
    const finToken = datosToken.exp * 1000;
    return new Date().getTime() >= finToken;
  }

  addAuditoriaAcceso(user: any): Observable<Auditoria> {
    const headers = new HttpHeaders({'X-Auth-Token': this.getToken()});
    return this.http.post<Auditoria>(this.env.apiUrl + LoginService.ENDPOINTS.auditarIngreso, user, {headers});
  }



  datosTemporalesDeUsuario(nombre, username, rol) {
    sessionStorage.setItem('nombre', nombre);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('rol', rol);
  }

  public getSucursal(): Observable<string> {
    return this.sucursal;
  }

  public setSucursal(sucursal: string){
    this.sucursal.next(sucursal);
  }

  eliminarSesion(timeout ?: boolean, usuario ?: string): Observable<string> {
    if(usuario){
      let body = {usuario: usuario};
      return this.http.post(this.env.apiUrl + LoginService.ENDPOINTS.eliminarSesion, body, {responseType: 'text'});
    }
    else if(this.getToken()){
      let token = JSON.parse(atob(this.getToken().split('.')[1]));
      let body = {usuario: null, idSesion: null};
      body.usuario = token.preferred_username
      if(timeout){
        body.idSesion = token.session_state;
      }
      return this.http.post(this.env.apiUrl + LoginService.ENDPOINTS.eliminarSesion, body, {responseType: 'text'});
    }
    else return null;
  }

  public getCurrentIp(): string {
    return this.currentIp ? this.currentIp : '10.0.0.0';
  }

  public getEncryptionKey(): Observable<any> {
    const headers = new HttpHeaders({ "X-Auth-Token": this.getToken(), 'X-IP': this.getCurrentIp() });
    const url = this.env.apiUrl + LoginService.ENDPOINTS.getEncryptionKey;
    const params: HttpParams = new HttpParams();
    console.log("Making GET request to: ", url);
    console.log(this.jwtToken)
    console.log("Headers: ", headers);

    return this.http.get<any>(url, { params: params, headers: headers }).pipe(
      tap(success => {
        console.log("Request successful", success);
        sessionStorage.setItem('encryptionKey', success.token);
      }),
      catchError(error => {
        console.log("Request failed", error);
        return throwError(error);
      })
    );
  }

}
