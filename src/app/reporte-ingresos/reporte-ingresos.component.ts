import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ErrorService } from '../services/error.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { ReporteIngreso } from '../DTO/reporte-ingreso';
import { LoginService } from '../services/HttpServices/login.service';
import { Reporte } from '../reporte-detalle/reporte';

@Component({
  selector: 'app-reporte-ingresos',
  templateUrl: './reporte-ingresos.component.html',
  styleUrls: ['./reporte-ingresos.component.css']
})

export class ReporteIngresosComponent extends Reporte{
  public ingresos: ReporteIngreso[] = null;
  exportColumns: any[];

  fechaHoy = new Date ();
  fechaDesde: Date;
  fechaHasta: Date;
  usuario: string;
  nroDoc: string;
  nroCaja: string;
  cuenta: string;

  constructor(
    datePipe: DatePipe,
    consultas: ConsultasService,
    loginService: LoginService,
    cajaSeguridadService: CajaseguridadService,
    errorService: ErrorService
  ) {
    super(datePipe, consultas, loginService, cajaSeguridadService, errorService);
  }

  protected setCabeceras(): any{
      return[
        {
           field: 'numeroDocumento',
           header: 'Nro Documento'
         },
        {
          field: 'nombreApellido',
          header: 'Apellido y Nombre'
        },
        {
          field: 'sucursal',
          header: 'Sucursal'
        },
        {
          field: 'fecha',
          header: 'Fecha'
        },
         {
           field: 'tipoIdentificacion',
           header: 'Tipo identificacion'
        },
        {
          field: 'nroCaja',
          header: 'Nro Caja'
        },
        {
          field: 'tiempoPermanencia',
          header: 'Tiempo'
        },
        {
          field: 'cuenta',
          header: 'Cuenta'
        }
      ]
  }

  public buscar(){
    let fechaHastaFormatted = null;
    let fechaDesdeFormatted = null;
    this.isLoading = true;
    if(this.fechaHasta && this.fechaDesde){
      if(this.fechaHasta.getTime() >= this.fechaDesde.getTime()){
        let diferencia = this.fechaHasta.getTime() - this.fechaDesde.getTime();
        if(diferencia < 15552000000){
          fechaDesdeFormatted = this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd') + " 00:00:00";
          fechaHastaFormatted = this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd') + " 23:59:59";
        }
        else{
          this.errorService.setMessage('warn', 'Portal de Clientes', 'La diferencia entre las fechas tiene que ser menor a 6 meses');
          this.isLoading = false;
          return;
        }
      }
      else{
        this.errorService.setMessage('warn', 'Portal de Clientes', 'La fecha hasta no puede ser menor que la fecha desde');
          this.isLoading = false;
          return;
      }
    }
    else if(this.fechaHasta && !this.fechaDesde || this.fechaDesde && !this.fechaHasta){
      this.errorService.setMessage('warn', 'Portal de Clientes', 'No se puede buscar solo con una fecha, complete la otra o no busque por fecha');
      this.isLoading = false;
      return;
    }
    let enoughParams = fechaHastaFormatted && fechaDesdeFormatted || this.usuario || this.nroCaja || this.cuenta || this.nroDoc && this.tipoDoc && this.pais;
    if(enoughParams){
      this.cajaSeguridadService.getReporteIngresos(this.sucursal, fechaDesdeFormatted, fechaHastaFormatted, this.usuario, this.nroCaja, this.cuenta,
      this.nroDoc, this.tipoDoc, this.pais).subscribe(success => {
        success.forEach(fila => {
          fila.numeroDocumento = fila.documento.numero
        })
        success.forEach (x => { 
          if (x.tipoIdentificacion == 'I') {x.tipoIdentificacion= 'Identificacion'}
          if (x.tipoIdentificacion == 'M') {x.tipoIdentificacion= 'Manual'}
          if (x.tipoIdentificacion == 'V') {x.tipoIdentificacion= 'Verificacion'}
        })
        this.ingresos = success;
      }, error => {
        this.errorService.procesarRespuestaError(error);
        this.isLoading = false;
      })
    }
    else{
      this.errorService.setMessage('warn', 'Portal de Clientes', 'Argumentos insuficientes para realizar la busqueda');
      this.isLoading = false;
    }
  }
  public limpiarFiltros(){
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.nroCaja = null;
    this.nroDoc = null;
    this.usuario = null;
    this.cuenta = null;
    this.pais = '80';
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        let respuestaMejorada = new Array();
        this.ingresos.forEach(ingreso => {
          let fila = new Array();
          this.cabeceras.forEach(cabecera => {
            fila[cabecera.header] = ingreso[cabecera.field];
          })
          respuestaMejorada.push(fila);
        })
        const worksheet = xlsx.utils.json_to_sheet(respuestaMejorada);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "reporte_ingresos");
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
    this.ingresos = null;
  }
}
