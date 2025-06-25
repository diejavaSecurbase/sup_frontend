import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { Cliente } from '../DTO/cliente';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { Caja } from '../DTO/Caja';
import { LoginService } from '../services/HttpServices/login.service';
import { AuditoriaRecinto } from '../DTO/AuditoriaRecinto';
import { Documento } from '../DTO/documento';
import { PersonaRecinto } from '../DTO/PersonaRecinto';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { FormMailComponent } from '../dynamicDialog/form-mail/form-mail.component';
import { FormTelefonoComponent } from '../dynamicDialog/form-telefono/form-telefono.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Email } from '../DTO/email';
import { Telefono } from '../DTO/telefono';

@Component({
  selector: 'app-cajaseguridad',
  providers: [DialogService],
  templateUrl: './cajaseguridad.component.html',
  styleUrls: ['../enrolamiento/enrolamiento.component.css']
})
export class CajaseguridadComponent implements OnInit {

  @Input() currentCliente: Cliente;
  @Input() cajasSeguridad: Caja[] = [];
  @Input() tipoIdentificacion: string;
  @Output() botonVolverBuscar: EventEmitter<any> = new EventEmitter<any>();
  cabeceras: any[];
  isLoading = true;
  pantallaActual = 'Listado';
  cajaSeleccionada: Caja = new Caja();
  cajasSeleccionadas: Caja[] = [];
  currentSucursal: string = null;
  cajas: Caja[] = [];
  datosRecinto: any;
  auditorias: AuditoriaRecinto[] = [];
  flag = 'flag flag-ar';
  flagNacionalidad = 'flag flag-ar';

  public opcionesTelefonos: SelectItem[] = [];
  public opcionesMails: SelectItem[] = [];
  public mail: Email;
  public telefono: Telefono;
  idCliente: string;
  documento: Documento;

  constructor( private errorService: ErrorService,
               private servicioCajas: CajaseguridadService,
               private loginService: LoginService,
               private confirmationService: ConfirmationService,
               private consultasService: ConsultasService,
               private ruteador: Router,
               public dialogService: DialogService) { }



  setTelefonoYMail(){
    const telefonos: SelectItem[] = new Array();
    this.currentCliente.telefonos.forEach(telefono => {
      let titulo = telefono.codigoArea + '-' + telefono.numero;
      telefonos.push({label: titulo,
      value: telefono});
    });
    const nuevosMails: SelectItem[] = new Array();
    this.currentCliente.emails.forEach(mail => {
      nuevosMails.push({label: mail.direccion, value: mail});
    })
    this.opcionesMails = nuevosMails;
    this.opcionesTelefonos = telefonos;
    if(this.opcionesMails.length > 0){
      this.mail = this.opcionesMails[0].value;
    }
    if(this.opcionesTelefonos.length > 0){
      this.telefono = this.opcionesTelefonos[0].value;
    }
  }

  ngOnInit(): void {    
    this.loadCabeceras();
    if(this.currentCliente != null){
      this.idCliente = this.currentCliente.id_persona;
      this.documento = {numero: this.currentCliente.numero_documento, pais: this.currentCliente.pais_documento, tipo: this.currentCliente.tipo_documento}
      if((!this.currentCliente.domicilios && !this.currentCliente.telefonos) || (this.currentCliente.domicilios.length <= 0 && this.currentCliente.telefonos.length <= 0)){
        this.consultasService.getDomicilioYTelefono(this.currentCliente)
        .subscribe(domytel=>{
           this.currentCliente.domicilios = domytel.domicilios;
           this.currentCliente.telefonos = domytel.telefonos; 
           this.setTelefonoYMail();
        })
      }
      else{
        this.setTelefonoYMail();
      }
    }
    this.loginService.getSucursal().subscribe(success => {
      this.currentSucursal = success;      
    });
  }

  loadCabeceras() {
    this.cabeceras =
  [
    {
      field: 'nroCajaSeguridad',
      header: 'Numero'
    },
    {
      field: 'estado',
      header: 'Estado'
    },
    {
      field: 'tipoAcceso',
      header: 'Tipo Acceso'
    },
    {
      field: 'modeloCaja',
      header: 'Modelo'
    },
    {
      field: 'frecuenciaDescripcion',
      header: 'Frecuencia'
    },
    {
      field: 'titularidad',
      header: 'Titularidad'
    }
  ]
  }

  abrirDetalleCaja(caja) {
    this.pantallaActual = 'Detalle';
    this.cajaSeleccionada = caja;
  }

  abrirEstadoRecinto() {
    this.servicioCajas.obtenerPersonasRecinto(this.currentSucursal).subscribe (clientes => {
      if (clientes.find(cliente => cliente.documento.numero === this.currentCliente.numero_documento) !== undefined) {
        this.errorService.setError(new Error('Información de Recinto', 'Portal de Clientes', 'El cliente seleccionado ya se encuentra en el recinto', '0'));
      } else {
        const personaRecinto = new PersonaRecinto();
        const doc = new Documento();
        doc.numero = this.currentCliente.numero_documento;
        doc.tipo = this.currentCliente.tipo_documento;
        doc.pais = this.currentCliente.pais_documento;
        personaRecinto.nombreApellido = this.currentCliente.nombre + ' ' + this.currentCliente.apellido;
        personaRecinto.documento = doc;
        personaRecinto.sucursal = this.currentSucursal;
        personaRecinto.tipoIdentificacion = this.tipoIdentificacion;
        const nrosCajas: string[] = [];
        const nrosCuentas: string[] = [];
        const tipoAccesos: string[] = [];
        this.cajasSeleccionadas.forEach(caja => {
          nrosCajas.push(caja.nroCajaSeguridad);
          nrosCuentas.push(caja.cuenta);
          tipoAccesos.push(caja.tipoAcceso);
        });
        personaRecinto.nroCaja = nrosCajas.join(',');
        personaRecinto.cuenta = nrosCuentas.join(',');
        personaRecinto.tipoAcceso = tipoAccesos.join(',');

        if(this.cajasSeleccionadas.length > 1){
          this.confirmationService.confirm({
            message: `¿Desea registrar el Ingreso al recinto del cliente ${personaRecinto.nombreApellido} en las cajas: ${this.listCajas(nrosCajas)}?`,
            header: 'Ingreso recinto',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.cajasSeleccionadas.forEach(caja => {
                const auditoria = new AuditoriaRecinto();
                doc.numero = this.currentCliente.numero_documento;
                doc.tipo = this.currentCliente.tipo_documento;
                doc.pais = this.currentCliente.pais_documento;
                auditoria.doc = doc;
                auditoria.sucursal = this.currentSucursal;
                auditoria.nroCaja = caja.nroCajaSeguridad;
                auditoria.cuenta = caja.cuenta;
                auditoria.tipoAcceso = caja.tipoAcceso;
                auditoria.nombreApellido = this.currentCliente.nombre + ' ' + this.currentCliente.apellido;
                auditoria.tipoIdent = this.tipoIdentificacion;
                auditoria.accion = 'I';
                this.auditorias.push(auditoria);
              });
      
              this.servicioCajas.insertarClienteRecinto(personaRecinto).subscribe(result => {
                this.servicioCajas.auditarRecinto(this.auditorias).subscribe(data => {
                  this.consultasService.setCurrentCliente(null, null);
                  this.ruteador.navigate(['cajas/estadoRecinto']);
                }, err => {
                });
              }, error => {
              });
            },
            reject: () => {
            }
          });
        }
        else{
          this.cajasSeleccionadas.forEach(caja => {
            const auditoria = new AuditoriaRecinto();
            doc.numero = this.currentCliente.numero_documento;
            doc.tipo = this.currentCliente.tipo_documento;
            doc.pais = this.currentCliente.pais_documento;
            auditoria.doc = doc;
            auditoria.sucursal = this.currentSucursal;
            auditoria.nroCaja = caja.nroCajaSeguridad;
            auditoria.cuenta = caja.cuenta;
            auditoria.tipoAcceso = caja.tipoAcceso;
            auditoria.nombreApellido = this.currentCliente.nombre + ' ' + this.currentCliente.apellido;
            auditoria.tipoIdent = this.tipoIdentificacion;
            auditoria.accion = 'I';
            this.auditorias.push(auditoria);
          });
  
          this.servicioCajas.insertarClienteRecinto(personaRecinto).subscribe(result => {
            this.servicioCajas.auditarRecinto(this.auditorias).subscribe(data => {
              this.consultasService.setCurrentCliente(null, null);
              this.ruteador.navigate(['cajas/estadoRecinto']);
            }, err => {
            });
          }, error => {
          });
        }     
      }
    });
  }
  

  private listCajas(array: string[]): string{
    let regreso = array[0];
    for(let x = 1; x < array.length; x++){
      regreso += ", " + array[x];
    }
    return regreso;
  }

  volver(){
    this.botonVolverBuscar.emit();
  }

  addOrRemoveRow(caja: Caja, event){
    if (event.checked === true){
      this.cajasSeleccionadas.push(caja);
    }else{
      this.cajasSeleccionadas.splice(this.cajasSeleccionadas.indexOf(caja), 1);
    }
  }

  public agregarTelefono(esObligatorio ?: boolean){
    let emit = new EventEmitter();
    emit.subscribe(success => {
      console.log(success);
      this.currentCliente.telefonos.push(success);
      this.opcionesTelefonos.push({label: success.codigoArea + '-' + success.numero, value: success});
      this.telefono = this.opcionesTelefonos[this.opcionesTelefonos.length - 1].value;
    })
      this.dialogService.open(FormTelefonoComponent, {width: '70%', height: '70%', header: 'Agregar Teléfono', data: {'idCliente': this.idCliente, 'emitter': emit, 'esObligatorio': esObligatorio, 'documento': this.documento}});
    
  }

  public editarTelefono(){
    let emit = new EventEmitter();
    emit.subscribe(success => {
      this.opcionesTelefonos.some(opcion => {
        if(opcion.value.id == success.id){
          let indice = this.currentCliente.telefonos.indexOf(opcion.value);
          console.log(indice);
          this.currentCliente.telefonos[indice] = success;
          opcion.value = success;
          opcion.label = success.codigoArea + '-' + success.numero;
          this.telefono = opcion.value;
          return true;
        }
      })
    })
    this.dialogService.open(FormTelefonoComponent, {width: '70%', height: '70%', header: 'Editar Teléfono', data: {'idCliente': this.idCliente, 'emitter': emit, 'isPatch': true, 'actual': this.telefono, 'documento': this.documento}});
  }

  public agregarMail(){
    let emit = new EventEmitter();
    emit.subscribe(success => {
      this.currentCliente.emails.push(success);
      this.opcionesMails.push({label: success.direccion, value: success});
      this.mail = this.opcionesMails[this.opcionesMails.length - 1].value;
    })
    this.dialogService.open(FormMailComponent, {width: '70%', height: '70%', header: 'Agregar Email', data: {'idCliente': this.idCliente, 'emitter': emit, 'documento': this.documento}});
  }

  public editarMail(){
    let emit = new EventEmitter();
    emit.subscribe(success => {
      this.opcionesMails.some(opciones => {
        if(opciones.value.id == success.id){
          let indice = this.currentCliente.emails.indexOf(opciones.value);
          console.log(indice);
          this.currentCliente.emails[indice] = success;
          opciones.value = success;
          opciones.label = success.direccion;
          this.mail = opciones.value;
          return true;
        }
      })
      this.opcionesMails.push({label: success.direccion, value: success});
      this.mail = this.opcionesMails[this.opcionesMails.length - 1].value;
    })
    this.dialogService.open(FormMailComponent, {width: '70%', height: '70%', header: 'Editar Email', data: {'idCliente': this.idCliente, 'emitter': emit, 'isPatch': true, 'actual': this.mail, 'documento': this.documento}});
  }

}
