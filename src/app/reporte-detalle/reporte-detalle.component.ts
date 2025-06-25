import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { ReporteDetalle } from '../DTO/reporte-detalle';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ErrorService } from '../services/error.service';
import { Reporte } from './reporte';

@Component({
  selector: 'app-reporte-detalle',
  templateUrl: './reporte-detalle.component.html'
})
export class ReporteDetalleComponent extends Reporte{
  public numCuenta: string;
  public cajaSeguridad: string;
  public numDoc: string;
  public detalles: ReporteDetalle[] = null;


  protected setCabeceras(): any{
    return[
          {
            field: 'sucursal',
            header: 'Sucursal'
          },
          {
            field: 'cuenta',
            header: 'Cuenta'
          },
          {
            field: 'nroCajaSeguridad',
            header: 'Caja'
          },
          {
            field: 'nroContrato',
            header: 'Nro Contrato'
          },
          {
            field: 'modeloCaja',
            header: 'Modelo de Caja'
          },
          {
            field: 'tipoContrato',
            header: 'Tipo Contrato'
          },
          {
            field: 'proximoVencimiento',
            header: 'Prox Vencimiento'
          },
          {
            field: 'montoAdeudado',
            header: 'Monto Adeudado'
          }
        ]
  }

  public limpiarFiltros(){
    this.cajaSeguridad = null;
    this.numCuenta = null;
    this.numDoc = null;
    this.pais = '80';
  }

  public buscar() {
    if(this.tipoDoc && this.numDoc && this.pais){
      this.isLoading = true;
      this.cajaSeguridadService.getReporteDetalle(this.sucursal, this.cajaSeguridad, this.numCuenta, this.numDoc, this.tipoDoc, this.pais).subscribe(success => {
          this.detalles = success;
        }, error => {
          this.errorService.procesarRespuestaError(error);
          this.isLoading = false;
        })
    }
    else{
      this.errorService.setMessage('warn', 'Portal de Clientes', 'Es obligatorio especificar el cliente, por favor completelo');
    }
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        let respuestaMejorada = new Array();
        this.detalles.forEach(ingreso => {
          let fila = new Array();
          this.cabeceras.forEach(cabecera => {
            fila[cabecera.header] = ingreso[cabecera.field];
          })
          respuestaMejorada.push(fila);
        })
        const worksheet = xlsx.utils.json_to_sheet(respuestaMejorada);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "reporte_detalle");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  public buscarAgain(){
    this.isLoading = false;
    this.detalles = null;
  }
}
