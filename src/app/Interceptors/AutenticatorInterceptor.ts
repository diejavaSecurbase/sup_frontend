import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError} from 'rxjs';
import { LoginService } from '../services/HttpServices/login.service';
import { mergeMap, concatMap, flatMap } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private servicioLogin: LoginService, private http: HttpClient, private errorService: ErrorService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
      if (!request.url.startsWith('http://localhost:9763') && !request.url.startsWith('http://localhost:3601')) {
        let clonedRequest = request.clone({/*withCredentials: true, */headers: request.headers.set('x-ip', this.servicioLogin.getCurrentIp())
        .set('x-aplicacion', this.servicioLogin.obtenerFunciones() != null && this.servicioLogin.obtenerFunciones().includes('CAJA_SEGURIDAD') ? 'PORTALCAJASEG' : 'PORTALCLIENTES')});

        if (!request.url.includes('acceso') && !request.url.includes('acceso/refrescar') && !request.url.includes('encryptionKey')
        && !request.url.includes('/egreso') && !request.url.includes('/sesion') && !(request.url.includes('/personasRecinto') && request.method == "GET")){
          return this.handleRequest(clonedRequest, next, true);
        }
        else{

          return this.handleRequest(clonedRequest, next, false);
        }

      }
      else {
        return this.handleRequest(request, next, false);
      }
    }

    private handleRequest(clonedRequest: HttpRequest<any>, next: HttpHandler, volverLogin: boolean): Observable<any>{
      return next.handle(clonedRequest).pipe(
        catchError(e => {
            if(volverLogin){
              if (e.status === 401) {
    
                  return this.http.post(this.servicioLogin.env.apiUrl + LoginService.ENDPOINTS.refreshToken, {refresh_token: this.servicioLogin.getRefreshToken()}, {observe: 'response'}).pipe(
                      concatMap((auth: any) => {
                        if(auth.status == 200){
                          this.servicioLogin.setToken(auth.body.access_token, auth.body.refresh_token);
    
                          clonedRequest = clonedRequest.clone({
                              setHeaders: {
                                  'X-Auth-Token': auth.body.access_token
                              }
                          });
    
                          return next.handle(clonedRequest);
                        }
                        else{
                          this.servicioLogin.logout(true);
                          this.errorService.setMessage("info", "Portal de Clientes", "Su sesion fue terminada, entre de nuevo", true);
                          return throwError(e);
                        }
                      }), catchError(error => {
                        let url: string = error.url;
                        if(url.includes('refrescar')){
                          this.servicioLogin.logout(true);
                          this.errorService.setMessage("info", "Portal de Clientes", "Su sesion fue terminada, entre de nuevo", true);
                        }
                        return throwError(error);
                      })
                  );
              }
              else if(e.status == 403){
                this.servicioLogin.logout(true);
                this.errorService.setMessage("info", "Portal de Clientes", "Su sesion fue terminada, entre de nuevo", true);
                return throwError(e);
              }
              else{
                return throwError(e);
              }
            }
            else{

              return throwError(e);
            }
        })
    );
  }
}