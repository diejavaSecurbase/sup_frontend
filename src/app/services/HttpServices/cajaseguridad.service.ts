import { PersonaRecinto } from './../../DTO/PersonaRecinto';
import { AuditoriaRecinto } from './../../DTO/AuditoriaRecinto';
import { AppRoutingModule } from './../../app-routing/app-routing.module';
import { Observable, BehaviorSubject } from 'rxjs';
import { DetalleCaja } from './../../DTO/DetalleCaja';
import { Caja } from './../../DTO/Caja';
import { Documento } from './../../DTO/documento';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { IdCaja } from 'src/app/DTO/IdCaja';
import { EstadoCajaRecinto } from 'src/app/DTO/estado-caja-recinto';
import { ParametrosRecinto } from 'src/app/DTO/ParametrosRecinto';
import { ErrorService } from '../error.service';
import { ReporteIngreso } from 'src/app/DTO/reporte-ingreso';
import { ReporteDetalle } from 'src/app/DTO/reporte-detalle';
import { environment } from 'src/environments/environment';
import { ConsultasService } from './consultas.service';


@Injectable({
  providedIn: 'root'
})
export class CajaseguridadService {

  public static ENDPOINTS = {
    consultaListado : '/cajas/v1.0/listado',
    consultaDetalle : '/cajas/v1.0/',
    parametrosRecinto: '/cajas/v1.0/parametrosRecinto',
    auditarRecinto: '/cajas/v1.0/recinto',
    personasRecinto: '/cajas/v1.0/personasRecinto',
    reporteIngresos: '/cajas/v1.0/detalleIngresos',
    reporteDetalle: '/cajas/v1.0/detalleCajaSeguridad'
  };

  private estadoRecintoSolido: EstadoCajaRecinto[] = null;
  private estadoRecinto: BehaviorSubject<EstadoCajaRecinto[]> = new BehaviorSubject(null);
  private sucursal: string;
  private tiempoAlerta: number = environment.TIEMPO_ALERTA_CS;
  private maxTiempo: number = environment.TIEMPO_MAX_RECINTO_CS;
  private personasRecinto: BehaviorSubject<PersonaRecinto[]> = new BehaviorSubject(null);
  private idIntervalo;

  private cajasCliente: Caja[] = null;
  
  constructor(private loginService: LoginService, private http: HttpClient, private env: EnvService, private errorService: ErrorService, private consultasService: ConsultasService) {
    try{
      const savedEstado: EstadoCajaRecinto[] = JSON.parse(localStorage.getItem('estadoRecinto'));
      this.estadoRecinto.next(savedEstado);
      this.estadoRecintoSolido = savedEstado;
    }
    catch(exc){}
    this.loginService.getSucursal().subscribe(success => {
      this.sucursal = success;
    })
    this.loginService.getFuncionesObservable().subscribe(funciones => {
      let tieneFuncion = false;
      if(funciones !== null ){
        tieneFuncion = funciones.some(funcion => {
          if(funcion == 'CAJA_SEGURIDAD'){
            //HARDCODE ROL
            return true;
          }});
      }
      clearInterval(this.idIntervalo)
      if(tieneFuncion){
        this.idIntervalo = this.iniciarIntervalo();
      }
    })
    this.consultasService.getCurrentIdObservable().subscribe(success => {
      if(success == null){
        this.cajasCliente = null;
      }
    })
  }

  consultaListadoCajas(tipoDoc: string, numDoc: any, pais: any): Observable<Caja[]>{
    return new Observable<Caja[]>(observer => {
      if(this.cajasCliente){
        observer.next(this.cajasCliente);
      }
      else{
        const params: HttpParams = new HttpParams()
        .append('numero_documento', numDoc.toString())
        .append('pais_documento', pais.toString())
        .append('tipo_documento', tipoDoc.toString());
        const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
        this.http.get<Caja[]>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.consultaListado, {headers, params}).subscribe(success => {
          this.cajasCliente = success;
          observer.next(success);
        }, failure => {
          observer.error(failure);
        });
      }

    })
  }

  consultaDetalleCaja(idCaja: string, idCajaSeguridad:string): Observable<DetalleCaja>{
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
        .append('idCajaSeguridad', idCajaSeguridad);        
        return this.http.get<DetalleCaja>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.consultaDetalle + idCaja + '/detalle', {headers, params});
  }

  iniciarIntervalo(){
    return setInterval(() => {
      this.obtenerPersonasRecinto(this.sucursal).subscribe(success => {
        this.personasRecinto.next(success);
        let tiempoMaxSuperado = false;
        tiempoMaxSuperado = success.some(persona => {
          const diferencia = new Date().getTime() - new Date(persona.fecha).getTime();
          if(diferencia >= this.maxTiempo * 60000){
            return true;
          }
        })
        if(tiempoMaxSuperado){
          this.errorService.setMessage('info', 'Estado Recinto', 'Recuerde registrar la salida de las personas en recinto');
        }
      })
    }, this.tiempoAlerta * 60000);
  }

  public getEstadoRecintoAsObservable(): Observable<EstadoCajaRecinto[]>{
    return this.estadoRecinto;
  }
  public addCajaAutorizada(estadoCaja: EstadoCajaRecinto){
    this.estadoRecintoSolido.push(estadoCaja);
    this.estadoRecinto.next(this.estadoRecintoSolido);
    localStorage.setItem('estadoRecinto', JSON.stringify(this.estadoRecintoSolido));
  }
  public removeCajaAutorizada(estadoCaja: EstadoCajaRecinto){
    this.estadoRecintoSolido.splice(this.estadoRecintoSolido.indexOf(estadoCaja), 1);
    this.estadoRecinto.next(this.estadoRecintoSolido);
    localStorage.setItem('estadoRecinto', JSON.stringify(this.estadoRecintoSolido));
  }

  getParametrosRecinto(): Observable<ParametrosRecinto>{
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.get<ParametrosRecinto>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.parametrosRecinto, {headers});
  }

  auditarRecinto(auditorias: AuditoriaRecinto[]): Observable<string>{
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.post(this.env.apiUrl + CajaseguridadService.ENDPOINTS.auditarRecinto, auditorias, {headers, responseType: 'text'});
  }

  obtenerPersonasRecinto(sucursal: string): Observable<PersonaRecinto[]>{
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append('sucursal', sucursal);
    return this.http.get<PersonaRecinto[]>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.personasRecinto, {headers, params});
  }

  insertarClienteRecinto(persona: PersonaRecinto): Observable<string> {
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.post(this.env.apiUrl + CajaseguridadService.ENDPOINTS.personasRecinto, persona, {headers, responseType: 'text'});
  }

  eliminarClienteRecinto(documento: string): Observable<string> {
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append('numero_documento', documento);
    return this.http.delete(this.env.apiUrl + CajaseguridadService.ENDPOINTS.personasRecinto,
      {headers, params, responseType: 'text'});
  }

  getReporteIngresos(sucursal: string, fecha_desde ?: string, fecha_hasta ?: string, usuario ?: string, numero_caja ?: string,
     cuenta ?: string, numero_documento ?: string, tipo_documento ?: string, pais_documento ?: string) : Observable<ReporteIngreso[]>{
      const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
      let params: HttpParams = new HttpParams();
      params = sucursal ? params.append('sucursal', sucursal) : params;
      params = fecha_desde && fecha_hasta ? params.append('fecha_desde', fecha_desde).append('fecha_hasta', fecha_hasta) : params;
      params = usuario ? params.append('usuario', usuario): params;
      params = numero_caja ? params.append('caja_seguridad', numero_caja) : params;
      params = cuenta ? params.append('numero_cuenta', cuenta) : params;
      params = numero_documento && tipo_documento && pais_documento ?
      params
      .append('numero_documento', numero_documento)
      .append('tipo_documento', tipo_documento)
      .append('pais_documento', pais_documento)
      : params;
      return this.http.get<ReporteIngreso[]>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.reporteIngresos, {headers, params});
  }

  getReporteDetalle(sucursal: string, numero_caja ?: string, cuenta ?: string, numero_documento ?: string,
     tipo_documento ?: string, pais_documento ?: string) : Observable<ReporteDetalle[]>{
     const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
     let params: HttpParams = new HttpParams();
     params = sucursal ? params.append('sucursal', sucursal) : params;
     params = numero_caja ? params.append('caja_seguridad', numero_caja) : params;
     params = cuenta ? params.append('numero_cuenta', cuenta) : params;
     params = numero_documento && tipo_documento && pais_documento ?
     params
     .append('numero_documento', numero_documento)
     .append('tipo_documento', tipo_documento)
     .append('pais_documento', pais_documento)
     : params;
     return this.http.get<ReporteDetalle[]>(this.env.apiUrl + CajaseguridadService.ENDPOINTS.reporteDetalle, {headers, params});
 }

 getPersonasRecintoObservable(): Observable<PersonaRecinto[]>{
   return this.personasRecinto;
 }
}
