import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cliente } from 'src/app/DTO/cliente';
import { DomicilioTelefono } from "src/app/DTO/domicilioTelefono";
import { EnvService } from 'src/app/env.service';
import { TipoDocumento } from 'src/app/DTO/tipo-documento';
import { ErrorService } from '../error.service';
import { IdentificacionCliente } from 'src/app/DTO/identificacion-cliente';
import { HuellaBack } from 'src/app/DTO/huella-back';
import { Documento } from 'src/app/DTO/documento';
import { Domicilio } from 'src/app/DTO/domicilio';
import { Generalizacion } from 'src/app/DTO/generalizacion';
import { Telefono } from 'src/app/DTO/telefono';
import { ParametrosEscaner } from 'src/app/DTO/parametros-escaner';
import { IdentificacionBiometrica } from 'src/app/DTO/identificacion-biometrica';
import { Error } from 'src/app/DTO/error';
import { Pais } from 'src/app/DTO/paises';
import { EnrolamientoFacialDTO } from 'src/app/DTO/EnrolamientoFacialDTO';
import { FotoEnrolamiento } from 'src/app/DTO/fotos-enrolamiento';
import { ResponseAuthHistory, ResponsePictureHistoryItem } from 'src/app/DTO/authHistory';
import { ListaAuditoriaCliente } from 'src/app/DTO/ListaAuditoriaCliente';
import { ListaDatosBajaCliente } from 'src/app/DTO/ListaDatosBajaCliente';
@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  public static ENDPOINTS = {
    buscarCliente : '/clientes/v1.0/identificacion',
    detalleCliente : '/clientes/v1.0/',
    tiposDocumentos: '/clientes/v1.0/tiposDocumentos',
    generalizar: '/clientes/v1.0/',
    enrolar: '/clientes/v1.0/',
    getParametros: '/clientes/v1.0/parametrosEscaneo',
    postTelefono: '/clientes/v1.0/', 
    identificacionBiometrica: '/clientes/v1.0/identificacionBiometrica',
    setDomicilioYTelefono:'/clientes/v1.0/domicilioYTelefono',
    paises:'/clientes/v1.0/paises',
    enrolamientoFacial: '/clientes/v1.0/enrolamientoFacial/',
    patchValidarManual: '/clientes/v1.0/enrolamientoFacial/',
    fotosEnrolamiento: '/recursoFacial',
    authHistory: '/clientes/v1.0/autenticaciones/',
    getAuditoria: '/clientes/v1.0/auditoria/',
    getRegistrosUsuario: '/clientes/v1.0/registroUsuario/',
    getRegistrosUsuarioBaja: '/clientes/v1.0/registroUsuarioBaja/',
    deleteEnrolamientoFacial: '/clientes/v1.0/enrolamiento-facial/',    
  };

  private currentIdentificador: BehaviorSubject<IdentificacionCliente> = new BehaviorSubject(null);
  private currentCliente: BehaviorSubject<Cliente> = new BehaviorSubject(null);
  private currentClienteFacial: BehaviorSubject<EnrolamientoFacialDTO> = new BehaviorSubject(null);
  private paises: Pais[] = null;

  constructor( private loginService: LoginService, private http: HttpClient, private env: EnvService, private errorService: ErrorService ) {
    this.loginService.getFuncionesObservable().subscribe(success => {
      if(success == null){
        this.setCurrentCliente(null, null);
      }
    })
  }

  public getDetalleCliente(idCliente: IdentificacionCliente): Observable<Cliente>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append("numero_documento", idCliente.numero_documento)
    .append("pais_documento", idCliente.pais_documento)
    .append("tipo_documento", idCliente.tipo_documento);
    return new Observable(observator => {
      this.http.get<Cliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idCliente.id_persona + "/detalle", {responseType: 'json', params: params, headers: headers}).subscribe(success => {
        this.setCurrentCliente(success, idCliente, true);
        observator.next(success);
      }, error => {
        observator.error(error);
      });
    })
  }

  public getClienteEnrollFacial(tipoDoc: any, numDoc: any, pais: any): Observable<EnrolamientoFacialDTO>{
    const params: HttpParams = new HttpParams()
    .append("numero_documento", numDoc.toString())
    .append("tipo_documento", tipoDoc.toString())
    .append("pais_documento", pais.toString());
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return new Observable<EnrolamientoFacialDTO>(observer=>{
        const newestheaders = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
        //despues de obtener el identificador consultamos el detalle de enrolamiento facial
        this.http.get<EnrolamientoFacialDTO>(this.env.apiUrl + ConsultasService.ENDPOINTS.enrolamientoFacial, {responseType: 'json', params: params, headers: newestheaders}).subscribe(finalSuccess=>{
          this.setCurrentClienteFacial(finalSuccess);
          observer.next(finalSuccess);
        }, finalFailure=>{
          this.errorService.procesarRespuestaError(finalFailure);
          observer.error();
        })
    });
  }

  public buscarCliente(tipoDoc: any, numDoc: any, pais: any): Observable<Cliente>{
    const params: HttpParams = new HttpParams()
    .append("numero_documento", numDoc.toString())
    .append("pais_documento", pais.toString())
    .append("tipo_documento", tipoDoc.toString());
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    console.log(this.env.apiUrl + ConsultasService.ENDPOINTS.buscarCliente)
    return new Observable<Cliente>(observer=>{
      this.http.get<IdentificacionCliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.buscarCliente,  {responseType: 'json', params: params, headers: headers}).subscribe(success=>{

        const newestheaders = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
        //despues de obtener el identificador consultamos el detalle completo
        this.http.get<Cliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + success.id_persona + "/detalle", {responseType: 'json', params: params, headers: newestheaders}).subscribe(finalSuccess=>{
          this.setCurrentCliente(finalSuccess, success);
          observer.next(finalSuccess);
        }, finalFailure=>{
          this.errorService.procesarRespuestaError(finalFailure);
          observer.error();
        })

      }, fail=>{
        console.log(fail)
        this.errorService.procesarRespuestaError(fail);
        observer.error();
      })
    });
  }
  // 1 metodo, getTelefonoYDomicilio() agregar a currentcliente
  public getDomicilioYTelefono(cliente:Cliente): Observable<DomicilioTelefono>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
        .append("numero_documento", cliente.numero_documento)
        .append("pais_documento", cliente.pais_documento)
        .append("tipo_documento", cliente.tipo_documento);
     return new Observable<DomicilioTelefono>(observer => {
      this.http.get<DomicilioTelefono>(this.env.apiUrl + '/clientes/v1.0/' + cliente.id_persona + '/domicilioYTelefono', {responseType: 'json', params: params, headers: headers})
      .subscribe(success =>{
        if(!success.domicilios && !success.telefonos){
          this.errorService.setError(new Error('Portal de clientes', 'Portal de Clientes', 'El domicilio y el telefono no pudieron ser verificados', '0'));
          observer.error(success);
        }else{
          observer.next(success);
        }
      }, failure=>{
        this.errorService.procesarRespuestaError(failure);
        observer.error(failure);
      })
    })
  }
  public verificarCliente(huellas: HuellaBack[], documento: Documento){

    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
        .append("numero_documento", documento.numero)
        .append("pais_documento", documento.pais)
        .append("tipo_documento", documento.tipo)
        .append("es_verificacion", "true");
    return new Observable<IdentificacionCliente>(observer => {
      this.http.get<IdentificacionCliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.buscarCliente,  {responseType: 'json', params: params, headers: headers}).subscribe(success=> {
        if(success.perfil_biometrico){
          this.identificarCliente(huellas, documento, true).subscribe(success => {
            observer.next(success);
          }, failure => {
            this.errorService.setError(new Error('Portal de clientes', 'Portal de Clientes', 'El cliente no pudo ser verificado por favor realizar ingreso manual', '0'));
            observer.error(failure);
          })
        }
        else{
          observer.error(success);
        }
      }, failure => {
        this.errorService.procesarRespuestaError(failure);
        observer.error(failure);
      })
    })
  }

  public identificarCliente(huellas: HuellaBack[], documento: Documento, noAlertas ?: boolean){
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const headersIdent = new HttpHeaders({"X-Auth-Token": this.loginService.getToken(), 'Encrypted': sessionStorage.getItem('encryptionWorking')});
    return new Observable<IdentificacionCliente>(observer => {
      this.http.post<IdentificacionBiometrica>(this.env.apiUrl + ConsultasService.ENDPOINTS.identificacionBiometrica, {huellas, documento}, {headers: headersIdent}).subscribe(success => {
      const params: HttpParams = new HttpParams()
        .append("numero_documento", success.numero_documento)
        .append("pais_documento", success.codigo_pais)
        .append("tipo_documento", success.tipo_documento);
        this.http.get<Cliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + success.idPersona + "/detalle", {responseType: 'json', params: params, headers: headers}).subscribe(finalSuccess=>{

          this.setCurrentCliente(finalSuccess, {id_persona: success.idPersona, pais_documento: success.codigo_pais, numero_documento: success.numero_documento, tipo_documento: success.tipo_documento, perfil_biometrico: true, fecha_enrolamiento: success.fecha_enrolamiento, fecha_ultima_actualizacion: success.fecha_ultima_actualizacion, sucursal_enrolamiento:success.sucursal_enrolamiento, usuario_enrolamiento:success.usuario_enrolamiento, usuario_actualizacion:success.usuario_actualizacion,fecha_ultima_identificacion: success.fecha_ultima_identificacion, fecha_ultima_verificacion: success.fecha_ultima_verificacion});
          observer.next(finalSuccess);
        }, finalFailure=>{
          if(!noAlertas){
            this.errorService.procesarRespuestaError(finalFailure);
          }
          observer.error(finalFailure);
        })
      }, failure => {
        if(!noAlertas){
          this.errorService.procesarRespuestaError(failure);
        }
        observer.error(failure);
      })
    })
  }

  public setCurrentCliente(cliente: Cliente, id: IdentificacionCliente, notShowMessage ?: boolean){
    if(cliente != null){
      if(!notShowMessage && cliente.es_empleado && !(this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH"))){
        this.errorService.setMessage('info', 'Portal de Clientes', 'El cliente es un empleado y no posee el rol para enrolarlo.');
      }
    }
    this.currentCliente.next(cliente);
    this.currentIdentificador.next(id);
  }

  public setCurrentClienteFacial(enrolamientoFacialDTO: EnrolamientoFacialDTO, id ?: IdentificacionCliente, notShowMessage ?: boolean){
    this.currentClienteFacial.next(enrolamientoFacialDTO);
    //this.currentIdentificador.next(id);
  }

  public getCurrentClienteFacialObservable(): Observable<EnrolamientoFacialDTO>{
    return this.currentClienteFacial;
  }

  public getCurrentClienteObservable(): Observable<Cliente>{
    return this.currentCliente;
  }

  public getCurrentClienteValue(): Cliente{
    return this.currentCliente.value;
  }
  public getCurrentIdObservable(): Observable<IdentificacionCliente>{
    return this.currentIdentificador;
  }

  public getTiposDocs(): Observable<TipoDocumento[]>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return this.http.get<TipoDocumento[]>(this.env.apiUrl + ConsultasService.ENDPOINTS.tiposDocumentos,
        {responseType: 'json', headers: headers});
  }
  public getPaises(): Observable<Pais[]>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return new Observable<Pais[]>(observer => {
      if(this.paises){
        observer.next(this.paises);
      }
      else{
        this.http.get<Pais[]>(this.env.apiUrl + ConsultasService.ENDPOINTS.paises,
          {responseType: 'json', headers: headers}).subscribe(success => {
            this.paises = success;
            observer.next(success);
          }, error => {
            observer.error(error);
          }); 
      }
    })
  }

  public generalizarHuellas(huellas: HuellaBack[], documento: Documento, idCliente: string): Observable<any> {
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken(), 'Encrypted': sessionStorage.getItem('encryptionWorking')});
    return this.http.post<any>(this.env.apiUrl + ConsultasService.ENDPOINTS.generalizar + idCliente + '/generalizar',
      {documento, huellas}, {responseType: 'json', headers: headers});
  }

  public enrolar( cuil: string, documento: Documento, domicilio: Domicilio, generalizaciones_template: Generalizacion[],
                  huellas: any[], telefono: Telefono, idCliente: string, huellas_no_tomadas: any[], aplicacion: string): Observable<any> {

    return this.actualizarOEnrolar(cuil, documento, domicilio, generalizaciones_template, huellas, telefono, idCliente, huellas_no_tomadas, aplicacion, '/enrolar');
  }

  public actualizar( cuil: string, documento: Documento, domicilio: Domicilio, generalizaciones_template: Generalizacion[],
                  huellas: any[], telefono: Telefono, idCliente: string, huellas_no_tomadas: any[], aplicacion: string): Observable<any> {

    return this.actualizarOEnrolar(cuil, documento, domicilio, generalizaciones_template, huellas, telefono, idCliente, huellas_no_tomadas, aplicacion, '/actualizar');
  }

  private actualizarOEnrolar( cuil: string, documento: Documento, domicilio: Domicilio, generalizaciones_template: Generalizacion[],
    huellas: any[], telefono: Telefono, idCliente: string, huellas_no_tomadas: any[], aplicacion: string, opcion: string): Observable<any> {

    const headers = new HttpHeaders({ 'X-Auth-Token': this.loginService.getToken(), 'X-Aplicacion': aplicacion, 'Encrypted': sessionStorage.getItem('encryptionWorking')});
    const huellasTotal = [];
    huellas.forEach(huellaArray => {
      huellaArray.forEach(huella => {
        huellasTotal.push(huella);
      });
    });
    return this.http.post<any>(this.env.apiUrl + ConsultasService.ENDPOINTS.enrolar + idCliente + opcion,
    {cuil, documento, domicilio, generalizaciones_template, huellas_scaneadas: huellasTotal, telefono, huellas_no_tomadas},
    {responseType: 'json', headers: headers});
}

  public getParametros(): Observable<ParametrosEscaner>{
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.get<ParametrosEscaner>(this.env.apiUrl + ConsultasService.ENDPOINTS.getParametros, {headers});
  }

  public postTelefono(idCliente: string, tipoTelefono, compania, num, codArea, documento: Documento){
    const body = {
//    "compania": compania,
      "codigo_area": codArea,
      "numero": num,
      "tipo_telefono": tipoTelefono,
      "pais": 80
    }
    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.post<number>(this.env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/telefono', body,{headers, params});
  }

  public patchTelefono(idCliente: string, id: string, tipoTelefono, compania, num, codArea, documento: Documento){
    const body = {
//    "compania": compania,
      "codigo_area": codArea,
      "numero": num,
      "tipo_telefono": tipoTelefono,
      "pais": 80
    }
    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.patch<number>(this.env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/telefono/' + id, body,{headers, params});
  }

  public postMail(idCliente: string, direccion, documento: Documento){
    const body = {
      'direccion': direccion
    }
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    return this.http.post<number>(this.env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail' , body,{headers, params});
  }

  public patchMail(idCliente: string, id: string, direccion, documento: Documento){
    const body = {
      'direccion': direccion
    }
    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.patch<number>(this.env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail/' + id, body,{headers, params});
  }

  public patchValidarManual(id: Uint8Array, id_persona: string, sucursal: string, documento: Documento){

    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    const headers = new HttpHeaders({'X-Auth-Token': this.loginService.getToken()});
    return this.http.patch<number>(this.env.apiUrl + ConsultasService.ENDPOINTS.patchValidarManual + id + '/' + id_persona + '/' + sucursal,{headers, params});
  }

  public getFotosEnrolamiento(id: Uint8Array, id_tramite: string) {
    const params: HttpParams = new HttpParams()
    .append("id_tramite", id_tramite)
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return this.http.get<FotoEnrolamiento[]>(this.env.apiUrl + ConsultasService.ENDPOINTS.patchValidarManual + id + ConsultasService.ENDPOINTS.fotosEnrolamiento,
        {responseType: 'json', params: params, headers: headers});
  }

  public getAuthHistory(id: string) {
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return this.http.get<ResponseAuthHistory>(this.env.apiUrl + ConsultasService.ENDPOINTS.authHistory + id, {responseType: 'json', headers: headers});
  }

  public getPictureByHistoryItem(id: string) {
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    return this.http.get<ResponsePictureHistoryItem>(this.env.apiUrl + ConsultasService.ENDPOINTS.authHistory + id + '/imagen', {responseType: 'json', headers: headers});
  }


  public getAuditoriasUsuario(idPersona: string, nroDocumento: string, paisDocumento: string, tipoDocumento:string, fechaDesde: string, fechaHasta: string): Observable<ListaAuditoriaCliente>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    
    const params: HttpParams = new HttpParams()
    .append("numero_documento", nroDocumento)
    .append("pais_documento", paisDocumento)
    .append("tipo_documento", tipoDocumento)
    .append("fechaDesde", fechaDesde)
    .append("fechaHasta", fechaHasta);
    return this.http.get<ListaAuditoriaCliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idPersona + "/auditoria-cliente", {responseType: 'json', params: params, headers: headers});
  }

  public getRegistroUsuarioBaja(idPersona: string, nroDocumento: string, paisDocumento: string, tipoDocumento:string): Observable<ListaDatosBajaCliente>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append("numero_documento", nroDocumento)
    .append("pais_documento", paisDocumento)
    .append("tipo_documento", tipoDocumento);
    return this.http.get<ListaDatosBajaCliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idPersona + "/registro-baja", {responseType: 'json', params: params, headers: headers});
  }

  public getRegistroUsuarioBajaPorFecha(fechaDesde: string, fechaHasta: string, cantidadRegistros:number): Observable<ListaDatosBajaCliente>{
    const headers = new HttpHeaders({"X-Auth-Token": this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append("fechaDesde", fechaDesde)
    .append("fechaHasta", fechaHasta)
    .append("cantidadRegistros", cantidadRegistros.toString());
    return this.http.get<ListaDatosBajaCliente>(this.env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + "registro-baja-por-fecha", {responseType: 'json', params:params ,headers: headers});
  }
 
  public deleteEnrolamientoHuella(idPersona: string, nroDocumento: string, paisDocumento: string, tipoDocumento:string, numero_gestar: string, aplicacion: string, motivo_baja: string){
    const headers = new HttpHeaders({ 'X-Auth-Token': this.loginService.getToken(),'X-Aplicacion': aplicacion, 'X-IP': this.loginService.getCurrentIp()});
    const body = {
      "documento": {
        "numero": nroDocumento,
        "pais": paisDocumento,
        "tipo": tipoDocumento
      },
      "id_persona": idPersona,
      "numero_gestar": numero_gestar,
      "motivo_baja": motivo_baja
    }
    const options = {
      headers: headers,
      body: body
    }
    return this.http.delete<any>(this.env.apiUrl + ConsultasService.ENDPOINTS.enrolar + 'enrolamientos', options);
  }
  public deleteEnrolamientoFacial(idEnrolamiento: string, documento: Documento){
    const headers = new HttpHeaders({ 'X-Auth-Token': this.loginService.getToken()});
    const params: HttpParams = new HttpParams()
    .append("numero_documento", documento.numero)
    .append("pais_documento", documento.pais)
    .append("tipo_documento", documento.tipo);
    return this.http.delete<any>(this.env.apiUrl + ConsultasService.ENDPOINTS.deleteEnrolamientoFacial +idEnrolamiento, {responseType: 'json',params: params,  headers: headers});
  }

}
