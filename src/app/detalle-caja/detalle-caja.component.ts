import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Caja } from '../DTO/Caja';
import { DetalleCaja } from '../DTO/DetalleCaja';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';

@Component({
  selector: 'app-detalle-caja',
  templateUrl: './detalle-caja.component.html'
})
export class DetalleCajaComponent implements OnInit {

  constructor( private cajasService: CajaseguridadService) { }

  @Input() caja: Caja = new Caja();
  @Output() botonVolver: EventEmitter<any> = new EventEmitter<any>();
  currentDetalle: DetalleCaja = new DetalleCaja();
  cabeceras: any[] = [];

  ngOnInit(): void {
    this.loadCabeceras();
    this.cajasService.consultaDetalleCaja(this.caja.idCaja, this.caja.idCajaSeguridad).subscribe(success => {
      this.currentDetalle = success;
      if (this.currentDetalle && this.currentDetalle.personas) {
        this.currentDetalle.personas.forEach( x => {
          if ((x.tipoDoc == '1' || x.tipoDoc == '2') && (!x.nroDoc.includes('-'))) {
            x.nroDoc = x.nroDoc.trim().substr(0,2) + '-' + x.nroDoc.substr(2, x.nroDoc.length-3) + '-' + x.nroDoc.substr(x.nroDoc.length-1);
          }
        })
        
      }
    });
  }

  volver() {
    this.botonVolver.emit();
  }

  loadCabeceras() {
    this.cabeceras =
  [
    {
      field: 'tipoDocDesc',
      header: 'Tipo Doc'
    },
    {
      field: 'nroDoc',
      header: 'Nro Documento'
    },
    {
      field: 'titularidad',
      header: 'Titularidad'
    },
    {
      field: 'apellidoNombre',
      header: 'Apellido y nombre'
    },
    {
      field: 'enrolado',
      header: 'Enrolado'
    }
  ]
  }

}
