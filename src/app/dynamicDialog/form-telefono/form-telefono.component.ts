import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConsultasService } from 'src/app/services/HttpServices/consultas.service';
import { ErrorService } from 'src/app/services/error.service';
import { Telefono } from '../../DTO/telefono';
import { Error } from 'src/app/DTO/error';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-telefono',
  templateUrl: './form-telefono.component.html',
  styleUrls: ['./form-telefono.component.css']
})
export class FormTelefonoComponent implements OnInit {

  public companias: SelectItem[];
  public tipos: SelectItem[];

  public tipo: string;
  public compania: string = null;
  public numTel: string = "";
  public codArea: string = "";
  public disabledNumero = false;
  public disabledCodigoArea = false;
  constructor(public ref: DynamicDialogRef, public conf: DynamicDialogConfig, private consultasService: ConsultasService, private errorService: ErrorService) { }

  ngOnInit(): void {

    //this.companias = [{label: "Claro", value: 'CLARO'}, {label: 'Personal', value: 'PERSONAL'}
    //, {label: 'Movistar', value: 'MOVISTAR'}, {label: 'Tuenti', value: 'TUENTI'}, {label: 'Nextel', value: 'NEXTEL'}, {label: '', value: null}];
    this.tipos = [{label: "Fijo", value: 'FIJO'}, {label: 'Celular', value: 'CELULAR'}, {label: '', value: null}];

    if(this.conf.data.isPatch){
      let telefono: Telefono = this.conf.data.actual;
      this.codArea = telefono.codigoArea;
      this.numTel = telefono.numero;
      //this.compania = telefono.operador;
      this.tipo = telefono.tipo;
    }
    else{
      //this.compania = this.companias[0].value;
      this.tipo = this.tipos[0].value;
    }
  }

  public confirmar(){
    /*if(this.compania == null){
      this.errorService.setMessage('warn', 'Portal de Clientes', 'Por favor seleccione un operador');
      return;
    }
    */
    if(this.tipo == null){
      this.errorService.setMessage('warn', 'Portal de Clientes', 'Por favor seleccione un tipo de teléfono');
      return;
    }
    if(this.getDigits(this.codArea) <= 4 && this.getDigits(this.numTel) <= 10 &&
    (this.getDigits(this.codArea) >= 2 && this.getDigits(this.numTel) >= 6))
    {
      let subscripccion: Observable<number>;
      if(this.conf.data.isPatch){
        subscripccion = this.consultasService.patchTelefono(this.conf.data.idCliente, this.conf.data.actual.id, this.tipo, this.compania, this.numTel, this.codArea, this.conf.data.documento);
      }
      else{
        subscripccion = this.consultasService.postTelefono(this.conf.data.idCliente, this.tipo, this.compania, this.numTel, this.codArea, this.conf.data.documento);
      }
      subscripccion.subscribe(success => {
        let telefono: Telefono = {codigoArea: this.codArea, numero: this.numTel, operador: this.compania, tipo: this.tipo, id: success};
        this.conf.data.emitter.emit(telefono);
        this.conf.data.emitter.complete();
        this.ref.close();
      }, error => {
        this.errorService.procesarRespuestaError(error);
        if(!this.conf.data.esObligatorio){
          this.ref.close();
        }
      });
    }
    else{
      if(!(this.getDigits(this.codArea) >= 2)){
        this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El cód. Área tiene que ser minimo de 2 digitos', '0'));
      }
      else if(!(this.getDigits(this.numTel) >= 6)){
        this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El número tiene que ser minimo de 6 digitos', '0'));
      }
      else if(!(this.getDigits(this.codArea) <= 4)){
        this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El cód. Área tiene que ser maximo de 4 digitos', '0'));
      }
      else if(!(this.getDigits(this.numTel) <= 10)){
        this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El número tiene que ser maximo de 10 digitos', '0'));
      }
    }

  }

  public cancelar(){
    this.ref.close();
  }

  public verificarCodigoArea(input:any){
      let codigo = Number(input.key);
      if(Number.isNaN(codigo) && input.key.length == 1){
        input.preventDefault();
      }
  }

  public cambiarTipoTelefono(event:string){
    this.numTel = '';
    this.codArea = '';
  }

  public noEvent(input: any){
    input.preventDefault();
  }

  protected getDigits(numero: string): number{
    return numero.length;
  }
}
