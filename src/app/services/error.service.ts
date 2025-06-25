import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Error } from '../DTO/error';
import { ErrorResponse } from '../DTO/error-response';
import { MessageService } from 'primeng/api';
import { IfStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private messageService: MessageService) { }

  private currentError: BehaviorSubject<Error> = new BehaviorSubject(null);
  private currentTimeOut: NodeJS.Timeout = null;
  private bloquearErrores = false;
  private procesando = false;

  public getError(): Observable<Error>{
    return this.currentError;
  }
  public setError(error: Error, severity ?: string){
    severity = severity ? severity : 'warn';
    this.setMessage(severity, error.titulo, error.detalle);
  }

  public setMessage(severity: string, summary: string, detail: string, bloquear ?: boolean){
    if(!this.bloquearErrores){
      if(bloquear)
        this.bloquearErrores = true;
      this.messageService.clear();
      setTimeout(() => {
        this.messageService.add({severity, sticky: false, life: 1000, summary, detail});
        // this.currentError.next(error);
        if (this.currentTimeOut != null){
          clearTimeout(this.currentTimeOut);
        }
        this.currentTimeOut = setTimeout(() => {
          this.messageService.clear();
          this.bloquearErrores = false;
          // this.currentError.next(null);
        }, 10000);
      }, 200)
    }
  }

  public procesarRespuestaError(respuestaError: any){
    try{
      const error: ErrorResponse = respuestaError.error;
      if(respuestaError.status != 401 && respuestaError.status != 403){
        this.setError(error.errores[0])
      }                                                                                                                                               
    }
    catch (exc){
      if(respuestaError.status && respuestaError.status != 401 && respuestaError.status != 403){
        this.setError(new Error('Portal de clientes', 'Portal de Clientes', 'Surgió un error inesperado, si continua comuníquese con un administrador', '0'));
      }
    }
  }
}
