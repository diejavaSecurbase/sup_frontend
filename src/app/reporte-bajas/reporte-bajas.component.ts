import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { SelectItem } from 'primeng/api';
import { Error } from '../DTO/error';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { GeneralLoadsService } from '../services/general-loads.service';
import { Cliente } from '../DTO/cliente';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { DatosCliente } from '../DTO/DatosCliente';
import { DatosBajaCliente } from '../DTO/DatosBajaCliente';
import { AuditoriaCliente } from '../DTO/AuditoriaCliente';
import { ModalViewDTO } from '../DTO/ModalViewDTO';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reporte-bajas',
  templateUrl: './reporte-bajas.component.html',
  styleUrls: ['./reporte-bajas.component.css']
})
export class ReporteBajasComponent implements OnInit, OnDestroy {

  public aplicacion: string = 'PORTALCLIENTES';
  private fallbackURL: string ='/baja-biometrica-huella/reportes';

  public paisesOrigen: SelectItem[];
  pais: string;
  public tiposDocs: SelectItem[] = null;
  tipoDoc: string;
  numDoc: number;
  public disabled: boolean = false;

  public currentCliente: Cliente = null;
  public currentId: IdentificacionCliente = null;

  menuRegistroUsuarioBajaActive: boolean;
  buscarSoloPorFecha: boolean;
  showSoloPorFecha: boolean = false;

  showSearch: boolean = false;

  datosUsuarioAuditoria: AuditoriaCliente[] = []

  datosUsuario: DatosCliente;

  datosUsuarioBaja: DatosBajaCliente[] = []
  bajas: DatosBajaCliente[] = []  //Lista que se filtra para la tabla

  isLoading = true;
  isBusquedaPorFecha : boolean;
  fechaDesde: Date;
  fechaHasta: Date;
  fechaHoy = new Date();
  busquedaPorFecha: boolean = false;
  minDate: Date;
  maxDateHasta: Date;

  attributeData: ModalViewDTO = new ModalViewDTO("", "");
  display: boolean = false;

  private subscripciones: Subscription[] = [];
  searchTextBajas: string = "";

  cantidadRegistros: number = 0;

  constructor(private consultas: ConsultasService, private errorService: ErrorService, private validacionesGenerales: GeneralLoadsService) { }

  ngOnInit(): void {
    this.attributeData.data = "";
    this.attributeData.header = "";
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 6);
    this.maxDateHasta = new Date();
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.consultas.setCurrentCliente(null, null);
    this.subscripciones.push(this.consultas.getCurrentClienteObservable().subscribe(success => {      
      this.currentCliente = success;
    }));
    this.subscripciones.push(this.consultas.getCurrentIdObservable().subscribe(success => {
      this.currentId = success;
    }));    

    this.subscripciones.push(
      this.consultas.getTiposDocs().subscribe(success => {
        success.sort((a, b) => {
          return a.orden - b.orden;
        })
        let nuevoTipos: SelectItem[] = new Array();
        success.forEach(tipo => {
          if (tipo.id != "CUIT") {
            nuevoTipos.push({
              label: tipo.id,
              value: tipo.codigoSoa
            });
          }
        })
        this.tiposDocs = nuevoTipos;
        this.tipoDoc = this.tiposDocs[0].value;
      }, error => {
        this.tiposDocs = [{ label: "DNI", value: "4" }];
        this.tipoDoc = this.tiposDocs[0].value;
      }));    
    
      this.subscripciones.push(
        this.consultas.getPaises().subscribe(success => {
          const nuevosPaises: SelectItem[] = new Array();
          success.forEach(pais => {
            nuevosPaises.push({ label: pais.descripcion, value: pais.orden.toString() });
          })
          this.paisesOrigen = nuevosPaises;
          this.pais = '80';
        }, error => {
          this.paisesOrigen = [{ label: "Argentina", value: 80 }]
          this.pais = '80';
        }));
    

  }

  ngOnDestroy(){
    this.subscripciones.forEach(subscripccion => {
      subscripccion.unsubscribe();
    })
  }

  goToRegistroUsuarioBajaMenu() {
    this.menuRegistroUsuarioBajaActive = true;
    this.showSearch = true;
    this.isBusquedaPorFecha = false;
  }

  goToRegistroUsuarioBajaPorFechaMenu() {
    this.buscarSoloPorFecha = true;
    this.showSearch = true;
    this.isBusquedaPorFecha = true;
  }


  cargaDatosRegistroUsuarioDadoBaja() {
    this.isLoading = false;
    //llamar servicio de carga de datos
    this.subscripciones.push(this.consultas.getRegistroUsuarioBaja(this.currentCliente.id_persona, this.currentCliente.numero_documento, this.currentCliente.pais_documento, this.currentCliente.tipo_documento).subscribe(data => {
      data.bajas.forEach(element => {
      if(element.fecha_enrolamiento != null)
        element.fecha_enrolamiento = new Date(element.fecha_enrolamiento)

      if (element.fecha_ult_actualizacion != null)
        element.fecha_ult_actualizacion = new Date(element.fecha_ult_actualizacion)

      if (element.fecha_ult_identificacion != null)
        element.fecha_ult_identificacion = new Date(element.fecha_ult_identificacion)

      if (element.fecha_baja != null) {          
        element.fecha_baja = new Date(element.fecha_baja)
      }

      if (element.fecha_ult_verificacion != null)
        element.fecha_ult_verificacion = new Date(element.fecha_ult_verificacion)
    });
    this.datosUsuarioBaja = data.bajas;
    this.searchInTableBajas();
    this.isLoading = false;
  }, err => {    
    this.isLoading = false;
          
  }));
      
  }

  cargaDatosRegistroUsuarioDadoBajaPorFecha() {
    this.isLoading = false;        
    if (this.validarInputsReporteBajaUsuario()) {
        let desde: Date = new Date(this.fechaDesde);
        desde.setDate(desde.getDate());
        let hasta: Date = new Date(this.fechaHasta);
        hasta.setDate(hasta.getDate());
        this.subscripciones.push(
          this.consultas.getRegistroUsuarioBajaPorFecha(this.validacionesGenerales.formatDateToString(desde), this.validacionesGenerales.formatDateToString(hasta), this.cantidadRegistros).subscribe(data => {
            data.bajas.forEach(element => {
              if(element.fecha_enrolamiento != null)
                element.fecha_enrolamiento = new Date(element.fecha_enrolamiento)

              if (element.fecha_ult_actualizacion != null)
                element.fecha_ult_actualizacion = new Date(element.fecha_ult_actualizacion)

              if (element.fecha_ult_identificacion != null)
                element.fecha_ult_identificacion = new Date(element.fecha_ult_identificacion)

              if (element.fecha_baja != null) 
                element.fecha_baja = new Date(element.fecha_baja)
              
              if (element.fecha_ult_verificacion != null)
                element.fecha_ult_verificacion = new Date(element.fecha_ult_verificacion)
            });
            this.datosUsuarioBaja = data.bajas;
            this.searchInTableBajas();
            this.buscarSoloPorFecha = false;
            this.showSoloPorFecha = true;
            this.isLoading = false;
          }, err => {
            this.isLoading = false;
          }));
        
        }      
    
  }
    backToButtons() {
    this.menuRegistroUsuarioBajaActive = false;
    this.buscarSoloPorFecha = false;
    this.showSearch = false;
    this.busquedaPorFecha = false;
    this.currentCliente = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.showSoloPorFecha = false;
    this.searchTextBajas = "";
    this.cantidadRegistros = 0;
    this.currentId = null;
    this.numDoc = null;
    this.consultas.setCurrentCliente(null, null);
    this.bajas = [];
  }

  validarInputsReporteBajaUsuario(){
    if (this.validarFechaInpunt(this.fechaDesde, "Desde") && this.validarFechaInpunt(this.fechaHasta, "Hasta") && this.validaCantidadRegistros(this.cantidadRegistros)){
      return true;
    }
    return false;
  }

  public verificarInput(input: string, tipoControl: string) {    
    this.disabled = this.validacionesGenerales.verificarInput(input, tipoControl);
  }

  public buscar() {
    //testing data nro doc: 10227620
    if (this.numDoc && this.tipoDoc && this.pais) {
      this.subscripciones.push(
        this.consultas.buscarCliente(this.tipoDoc, this.numDoc, this.pais).subscribe(success => {
          this.cargaDatosRegistroUsuarioDadoBaja();        
      }, error => {
        
        this.isLoading = false;
        this.numDoc = null;
      }));
      
    }
    else {
      this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese un número de documento", "0"));
    }

  }

  public buscarAgain() {
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.consultas.setCurrentCliente(null, null);
  }

  searchInTableBajas() {
    this.bajas = [];
    for (let item of this.datosUsuarioBaja) {
      if (this.aplicarFiltroBajas(item)) {
        this.bajas.push(item);
      }
    }
  }

  aplicarFiltroBajas(item: DatosBajaCliente): boolean {
    let response = false;
    if (this.searchTextBajas != '') {
      item.highlighted = [];
      if (this.validateItem(item.dbid, this.searchTextBajas))
        {
          item.highlighted.push('DBID');
          response = true;
        }
      if (this.validateItem(item.sucursal.toString(), this.searchTextBajas))
        {
          item.highlighted.push('SUCURSAL');
          response = true;
        }
      if (this.validateItem(this.validacionesGenerales.formatDate(item.fecha_enrolamiento).toString(), this.searchTextBajas))
        {
          item.highlighted.push('FECHA_ENR');
          response = true;
        }
      if (this.validateItem(this.validacionesGenerales.formatDate(item.fecha_ult_actualizacion).toString(), this.searchTextBajas))
        {
          item.highlighted.push('FECHA_ULT_ACT');
          response = true;
        }
      if (this.validateItem(this.validacionesGenerales.formatDate(item.fecha_ult_identificacion).toString(),this.searchTextBajas))
        {
          item.highlighted.push('FECHA_ULT_IDEN');
          response = true;
        }
      if (this.validateItem(this.validacionesGenerales.formatDate(item.fecha_ult_verificacion).toString(), this.searchTextBajas))
        {
          item.highlighted.push('FECHA_ULT_VER');
          response = true;
        }
      if (this.validateItem(item.dbid_duplicado, this.searchTextBajas))
        {
          item.highlighted.push('DBID_DUPLICADO');
          response = true;
        }
      if (this.validateItem(item.nro_gestar, this.searchTextBajas))
        {
          item.highlighted.push('NRO_GESTAR');
          response = true;
        }
      if (this.validateItem(this.validacionesGenerales.formatDate(item.fecha_baja).toString(), this.searchTextBajas))
        {
          item.highlighted.push('FECHA_BAJA');
          response = true;
        }
      if (this.validateItem(item.usuario, this.searchTextBajas))
        {
          item.highlighted.push('USUARIO');
          response = true;
        }
      if (this.validateItem(item.usuario_enr, this.searchTextBajas))
        {
          item.highlighted.push('USUARIO_ENR');
          response = true;
        }
      if (this.validateItem(item.usuario_act,this.searchTextBajas))
        {
          item.highlighted.push('USUARIO_ACT');
          response = true;
        }
      if (this.validateItem(item.id_persona.toString(),this.searchTextBajas))
        {
          item.highlighted.push('ID_PERSONA');
          response = true;
        }
      if(this.validateItem(item.motivo_baja, this.searchTextBajas))
        {
          item.highlighted.push('MOTIVO_BAJA');
          response = true;
        }
    }else{
        item.highlighted = [];
        response = true;
    }
    return response;
  }

  validateItem(item: string, itemComparate:string){
   
    if(item != null && item.toLowerCase().includes(itemComparate.toLowerCase())){
      return true;
    }  
    return false;
  }

  constructBajaUserLabels(data:DatosBajaCliente){
    if(data != null ) {
      let splittedDBID= data.dbid.split(":");
      return "<b> id_persona: </b>" + data.id_persona + '<br>' + "<b> País: </b>" + splittedDBID[0] + " - <b> Tipo de Documento: </b>" + splittedDBID[1] + " - <b> Número de Documento: </b>" + splittedDBID[2];  
    }
  }
    
  
  onChangeDesde(){
    this.fechaHasta = null;   
    this.maxDateHasta = this.validacionesGenerales.onChangeDesde(this.fechaDesde, this.fechaHoy);
  }

  validarFechaInpunt(fecha:Date, descripcion: string){
    if (fecha == null){
      this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese una Fecha"+ descripcion +" valida", "0"));
      return false;
    }
    return true;
  }

  validaCantidadRegistros(cant: number){
    if (cant < 0){
      this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor seleccione una cantidad de registros mayor o igual a 0", "0"));
      return false;
    }
    return true;
  }
 
}
