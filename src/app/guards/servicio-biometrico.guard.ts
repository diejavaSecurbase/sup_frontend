import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { HuellaService } from '../services/HttpServices/huella.service';
import { XfsApiService } from '../services/huella/xfs-api.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioBiometricoGuard implements CanActivate {
  constructor( private xfsService : XfsApiService,
                private errorService: ErrorService,
                private servicioBiom: HuellaService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable<boolean>(observer => {
      this.xfsService.cancelScanFingerprint().subscribe(success => this.revisarConexion(observer), failure => this.revisarConexion(observer))
    });
  }

  private revisarConexion(observer: Subscriber<boolean>){
    observer.next(true);
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      if (success.status === "NO_DEVICE"){
        observer.next(false);
        this.errorService.setMessage('warn', 'Portal de clientes', 'Por favor conecte su escáner biométrico para continuar');
      }else{
        observer.next(true);
      }
    }, failure =>{
      this.servicioBiom.cancelarEscaneo().subscribe(success => {
        if (success === false){
          observer.next(false);
          this.errorService.setMessage('warn', 'Portal de clientes', 'Por favor conecte su escáner biométrico para continuar');
        }
        else{
          observer.next(true);
        }  
      }, failure =>{
        observer.next(false);
        this.errorService.setMessage('warn', 'Portal de clientes', 'Para operar con Biometría debe tener instalado los servicios biométricos');
      });});
  }
}
