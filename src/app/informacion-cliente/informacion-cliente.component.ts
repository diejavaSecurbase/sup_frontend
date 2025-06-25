import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../DTO/cliente';
import { Documento } from '../DTO/documento';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';

@Component({
  selector: 'app-informacion-cliente',
  templateUrl: './informacion-cliente.component.html'
})
export class InformacionClienteComponent implements OnInit {

  @Input() currentCliente: Cliente;
  @Input() currentId: IdentificacionCliente;
  @Input() infoExtra: boolean;

  idCliente: string;
  documento: Documento;
 
  constructor() {  
    //
  }

  ngOnInit(): void {
  
    if(this.currentCliente != null) {
      this.idCliente = this.currentCliente.id_persona;
      this.documento = {numero: this.currentCliente.numero_documento, pais: this.currentCliente.pais_documento, tipo: this.currentCliente.tipo_documento}
    
    }
    this.validateDataCurrentId();
   
  }
  
  private validateDataCurrentId(){
      if(this.currentId){
      if(this.currentId.usuario_enrolamiento === null || this.currentId.usuario_enrolamiento === undefined){
         this.currentId.usuario_enrolamiento = "Sin Dato";
      }
      if(this.currentId.usuario_actualizacion === null || this.currentId.usuario_actualizacion === undefined){
        this.currentId.usuario_actualizacion = "Sin Dato";
      }
      if(this.currentId.sucursal_enrolamiento === null || this.currentId.sucursal_enrolamiento === undefined){
        this.currentId.sucursal_enrolamiento = "Sin Dato";
      }
    }  
  }
}
