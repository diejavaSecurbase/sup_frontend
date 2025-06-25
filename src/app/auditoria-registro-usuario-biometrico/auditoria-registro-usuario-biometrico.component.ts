import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { SelectItem } from 'primeng/api';
import { Error } from '../DTO/error';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { GeneralLoadsService } from '../services/general-loads.service';
import { Cliente } from '../DTO/cliente';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { DatosCliente } from '../DTO/DatosCliente';
import { AuditoriaCliente } from '../DTO/AuditoriaCliente';
import { ModalViewDTO } from '../DTO/ModalViewDTO';


@Component({
  selector: 'app-auditoria-registro-usuario-biometrico',
  templateUrl: './auditoria-registro-usuario-biometrico.component.html',
  styleUrls: ['./auditoria-registro-usuario-biometrico.component.css']
})
export class AuditoriaRegistroUsuarioBiometricoComponent implements OnInit {

  public aplicacion: string = 'PORTALCLIENTES';
  private fallbackURL: string ='/auditoria-registro';

  public paisesOrigen: SelectItem[];
  pais: string;
  public tiposDocs: SelectItem[] = null;
  tipoDoc: string;
  numDoc: number;
  public disabled: boolean = false;

  public currentCliente: Cliente = null;
  public currentId: IdentificacionCliente = null;

  menuAuditoriaActive: boolean;
  buscarSoloPorFecha: boolean;
  showSoloPorFecha: boolean = false;

  showSearch: boolean = false;

  datosUsuarioAuditoria: AuditoriaCliente[] = []
  auditorias: AuditoriaCliente[] = [] //Lista que se filtra para la tabla

  datosUsuario: DatosCliente;

  isLoading = true;
  fechaDesde: Date;
  fechaHasta: Date;
  fechaHoy = new Date();
  busquedaPorFecha: boolean = false;
  minDate: Date;
  maxDateHasta: Date;

  attributeData: ModalViewDTO = new ModalViewDTO("", "");
  display: boolean = false;

  searchTextAuditoria: string = "";

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

    this.consultas.getCurrentClienteObservable().subscribe(success => {
      this.currentCliente = success;
    })
    this.consultas.getCurrentIdObservable().subscribe(success => {
      this.currentId = success;
    })

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
    })

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
    });

  }

  goToAuditoriaMenu() {
    this.menuAuditoriaActive = true;
    this.busquedaPorFecha = true;
    this.showSearch = true;
  }

  cargaDatosAuditoria() {
    this.isLoading = false;
    let desde: Date = new Date(this.fechaDesde);
    desde.setDate(desde.getDate())
    let hasta: Date = new Date(this.fechaHasta);
    hasta.setDate(hasta.getDate())
    this.consultas.getAuditoriasUsuario(this.currentCliente.id_persona, this.currentCliente.numero_documento, this.currentCliente.pais_documento, this.currentCliente.tipo_documento, this.validacionesGenerales.formatDateToString(desde), this.validacionesGenerales.formatDateToString(hasta)).subscribe(data => {
      data.auditorias.forEach((element, index) => {
        element.fecha = new Date(element.fecha)
        element.posicionLista = index;
      });
      this.datosUsuarioAuditoria = data.auditorias;
      this.searchInTableAuditorias();
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

    backToButtons() {
    this.menuAuditoriaActive = false;
    this.buscarSoloPorFecha = false;
    this.showSearch = false;
    this.busquedaPorFecha = false;
    this.currentCliente = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.showSoloPorFecha = false;
    this.searchTextAuditoria = "";
    this.cantidadRegistros = 0;
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.consultas.setCurrentCliente(null, null);
    this.auditorias=[];
  }

  public verificarFechas(): boolean {
    let desde = new Date(this.fechaDesde)
    let hasta = new Date(this.fechaHasta)
    if (desde.getTime() > hasta.getTime())
      return false;
    return true;
  }


  public verificarInput(input: string, tipoControl: string) {    
    this.disabled = this.validacionesGenerales.verificarInput(input, tipoControl);
  }

  public buscar() {
    //testing data nro doc: 10227620
    if (this.numDoc && this.tipoDoc && this.pais) {
      this.consultas.buscarCliente(this.tipoDoc, this.numDoc, this.pais).subscribe(success => {

        if (this.menuAuditoriaActive) {
          if (this.fechaDesde != null)
            if (this.fechaHasta != null)
              if (this.verificarFechas())
                this.cargaDatosAuditoria();
              else {
                this.currentCliente = null;
                this.currentId = null;
                this.consultas.setCurrentCliente(null, null);
                this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "La Fecha Desde no puede ser mayor a la Fecha Hasta", "0"));
              }
            else {
              this.currentCliente = null;
              this.currentId = null;
              this.consultas.setCurrentCliente(null, null);
              this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese una Fecha Hasta valida", "0"));
            }
          else {
            this.currentCliente = null;
            this.currentId = null;
            this.consultas.setCurrentCliente(null, null);
            this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese una Fecha Desde valida", "0"));
          }
        }
        
       
      }, error => {
        this.numDoc = null;
      })
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

  public showIndex(rowIndex){
    this.attributeData.header = 'Parámetros y Detalles';
    console.log(this.datosUsuarioAuditoria[rowIndex])
    console.log(rowIndex);
    if(this.datosUsuarioAuditoria[rowIndex].detalle === null || this.datosUsuarioAuditoria[rowIndex].detalle === "")
      this.datosUsuarioAuditoria[rowIndex].detalle = "Sin Detalle"
    this.attributeData.data ="<h4>Parámetros: </h4>" + this.datosUsuarioAuditoria[rowIndex].parametros + "<br><br>" +"<h4>Detalles: </h4>"  + this.datosUsuarioAuditoria[rowIndex].detalle;
    this.display = true;
  }

  searchInTableAuditorias() {
    this.auditorias = [];
    for (let item of this.datosUsuarioAuditoria) {
      if (this.aplicarFiltroAuditorias(item)) {
        this.auditorias.push(item);
      }
    }
  }

  aplicarFiltroAuditorias(item:AuditoriaCliente):boolean{
    let response = false;
    if(this.searchTextAuditoria != ''){
      item.highlighted = [];
      console.log(this.searchTextAuditoria)
      if(item.fecha != null)
        if(this.validacionesGenerales.formatDate(item.fecha).toString().toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('FECHA');
          response = true;
        }
      if(item.tipo_operacion != null)
        if(this.nombreTipoOperacion(item.tipo_operacion).toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('TIPO_OPERACION');
          response = true;
        }
      if(item.idusuario != null)
        if(item.idusuario.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('ID_USUARIO');
          response = true;
        }
      if(item.duracion_ms != null)
        if(item.duracion_ms.toString().toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('DURACION_MS');
          response = true;
        }
      if(item.resultado != null)
        if(item.resultado.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('RESULTADO');
          response = true;
        }
        if(item.canal != null)
          if(item.canal.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
            item.highlighted.push('CANAL');
            response = true;
        }
      if(item.detalle != null)
        if(item.detalle.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('DETALLE');
          response = true;
        }
      if(item.parametros != null)
        if(item.parametros.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('DETALLE');
          response = true;
        }
      if(item.sucursal != null)
        if(item.sucursal.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('SUCURSAL');
          response = true;
        }
      if(item.score != null)
        if(item.score.toLowerCase().includes(this.searchTextAuditoria.toLowerCase())){
          item.highlighted.push('SCORE');
          response = true;
        }
    }else{
      item.highlighted = [];
      response = true;
    }
    return response;
  }

    constructPaisTipoNroDoc(data:string){
      let splittedIdUsuario= data.split(":");
      return "<b> País: </b>" + splittedIdUsuario[0] + " - <b> Tipo de Documento: </b>" + splittedIdUsuario[1] + " - <b> Número de Documento: </b>" + splittedIdUsuario[2];
      }
    
    nombreTipoOperacion(letra:string){
    switch (letra.toUpperCase()){
      case "I": return "Identificación";
      case "V": return "Verificación";
      case "E": return "Enrolamiento";
      case "G": return "Generalización";
      case "A": return "Actualización";
      case "R": return "Re-Enrolamiento";
      case "B": return "Baja";
      default: return letra;
    }
  }
  
  onChangeDesde(){    
    this.fechaHasta = null;   
    this.maxDateHasta = this.validacionesGenerales.onChangeDesde(this.fechaDesde, this.fechaHoy);
  
  }
 
}
