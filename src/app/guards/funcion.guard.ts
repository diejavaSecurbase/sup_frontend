import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/HttpServices/login.service';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { XfsApiService } from '../services/huella/xfs-api.service';
import { HuellaService } from '../services/HttpServices/huella.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionGuard implements CanActivate {
  constructor(private loginService: LoginService, 
              private router: Router, 
              private errorService: ErrorService, 
              private xfsService : XfsApiService,
              private huellaService: HuellaService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.xfsService.cancelScanFingerprint().subscribe(success => {
      }, 
      error => {
        this.huellaService.cancelarEscaneo().subscribe()
      }
      );
    const rolesEsperados: any[] = next.data.rolesEsperados;
    if(rolesEsperados){
      let isAuthorized = this.loginService.obtenerFunciones().some(funcion=>{
        if(rolesEsperados.includes(funcion)){
          return true;
        }
      })
      if(isAuthorized){
        return true;
      }
      this.errorService.setError(new Error("Portal de clientes", "Portal de clientes", "Usuario está logueado pero no tiene acceso a la función específica", "0"));
    }
    else{
      return true;
    }
  }
}
