import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';
import { Error } from '../DTO/error';

@Injectable({
  providedIn: 'root'
})
export class GeneralLoadsService {

  constructor(private errorService: ErrorService) { }

  // verificar Input String
  public verificarInput(input: string, tipoControl: string) {
    let dni = Number(input);
    if (!Number(input) || dni < 0 || isNaN(dni) || input[0] == '+' || !Number.isInteger(dni) || input[input.length - 1] == '.') {
      this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'Por favor, ingrese un numero de ' + tipoControl + ' valido.', '0'));
      return true;
    } 
    return false;
  }

  public formatDate(date) {
    if (date != null) {
      const originalDate = new Date(date);

      const day = String(originalDate.getDate()).padStart(2, '0');
      const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
      const year = originalDate.getFullYear();
      const hours = String(originalDate.getHours()).padStart(2, '0');
      const minutes = String(originalDate.getMinutes()).padStart(2, '0');
      const seconds = String(originalDate.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
       
    }
    else {
      return "";
    }
  }
 public  formatDateToString(date:Date){
  return (date.getDate()) + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "+ date.getHours() + ":" + date.getMinutes();
 }

 public onChangeDesde(fechaDesde:Date, fechaHoy: Date): Date {
    let maxDateHasta = new Date();
    maxDateHasta.setFullYear(fechaDesde.getFullYear());
    maxDateHasta.setMonth(fechaDesde.getMonth() + 1);
    maxDateHasta.setDate(fechaDesde.getDate() + 10);

    if(maxDateHasta > fechaHoy){
      maxDateHasta.setMonth(fechaHoy.getMonth()); 
      maxDateHasta.setDate(fechaHoy.getDate()); 
    }
    return maxDateHasta;
 }

}
