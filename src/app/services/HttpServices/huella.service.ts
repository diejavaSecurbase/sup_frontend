import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Huella } from 'src/app/DTO/Huella';
import { Ticket } from 'src/app/DTO/Ticket';

@Injectable({
  providedIn: 'root'
})
export class HuellaService {

  private static ENDPOINTS = {
    escanearHuella: environment.servBiometrico + 'v2.0/escanearHuella',
    verificarConexion: environment.servBiometrico + 'escanerHuellasConectado',
    cancelarEscaneo: environment.servBiometrico + 'cancelarEscaneoHuella',
    printTicket: environment.servBiometrico + 'printTicketBase64'
  };

  constructor(public http: HttpClient) {}

  verificarConexionBiometrico(): Observable<boolean> {
   /* let ob = Observable.create(observer => {
      observer.next(true)
      observer.complete()
    })
    return ob*/
    return this.http.get<any>(HuellaService.ENDPOINTS.verificarConexion);
  }

  escanearHuella(dedo: string): Observable<Huella> {
    return this.http.post<Huella>(HuellaService.ENDPOINTS.escanearHuella, {dedo, wsqCompression: 5}, {responseType: 'json'});
  }

  cancelarEscaneo(): Observable<any> {
  /*  let ob = Observable.create(observer => {
      observer.next(true)
      observer.complete()
    })
    return ob*/
   return this.http.post<any>(HuellaService.ENDPOINTS.cancelarEscaneo, {responseType: 'text'});
  }

  public printTicket(infoTicket: Ticket): Observable<any> {
    return this.http.post<any>(HuellaService.ENDPOINTS.printTicket, infoTicket);
  }


}
