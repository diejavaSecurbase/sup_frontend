import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginService } from '../services/HttpServices/login.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { ErrorService } from '../services/error.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoGuard implements CanActivate {

  constructor(private loginService: LoginService, private consultasService: ConsultasService, private errorService: ErrorService){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let success = this.consultasService.getCurrentClienteValue();
      if(!success.es_empleado || success.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH"))){
        return true;
      }
      else{
        this.errorService.setMessage('warn', 'Portal de Clientes', 'El cliente es un empleado y no posee el rol para enrolarlo.');
        return false;
      }
  }
}
