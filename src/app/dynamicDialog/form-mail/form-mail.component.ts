import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConsultasService } from 'src/app/services/HttpServices/consultas.service';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-mail',
  templateUrl: './form-mail.component.html',
  styleUrls: ['./form-mail.component.css']
})
export class FormMailComponent implements OnInit {

  public mail: string;

  constructor(public ref: DynamicDialogRef, public conf: DynamicDialogConfig, private consultasService: ConsultasService, private errorService: ErrorService) { }
  ngOnInit(): void {
    if(this.conf.data.isPatch){
      this.mail = this.conf.data.actual.direccion;
    }
  } 

  confirmar(){
    let subscripccion: Observable<number>;
    if(this.conf.data.isPatch){
      subscripccion = this.consultasService.patchMail(this.conf.data.idCliente, this.conf.data.actual.id, this.mail, this.conf.data.documento);
    }
    else{
      subscripccion = this.consultasService.postMail(this.conf.data.idCliente, this.mail, this.conf.data.documento);
    }
    subscripccion.subscribe(success => {
      
      this.conf.data.emitter.emit({'direccion': this.mail, id: success});
      this.conf.data.emitter.complete();
      this.ref.close()
    }, error => {
      this.errorService.procesarRespuestaError(error);
      this.ref.close();
    })
  }

  public cancelar(){
    this.ref.close();
  }
}
