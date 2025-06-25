import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cliente } from '../DTO/cliente';
import { EnrolamientoComponent } from '../enrolamiento/enrolamiento.component';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-biometria-cajas',
  templateUrl: '../enrolamiento/enrolamiento.component.html',
  providers: [DialogService],
  styleUrls: ['./biometria-cajas.component.css', '../enrolamiento/enrolamiento.component.css']
})
export class BiometriaCajasComponent extends EnrolamientoComponent implements OnInit, OnDestroy {
  public aplicacion: string = 'CAJASEG';
  public mostrarMetdo = true;
  protected fallbackURL: string =  '/biometria';
  ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnDestroy(): void{
    super.ngOnDestroy();
  }
}
