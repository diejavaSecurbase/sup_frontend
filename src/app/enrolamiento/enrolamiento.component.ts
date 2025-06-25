
import { Component, OnInit, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { Cliente } from '../DTO/cliente';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Domicilio } from '../DTO/domicilio';
import { Telefono } from '../DTO/telefono';
import {SelectItem, MessageService, ConfirmationService} from 'primeng/api';
import { Huella } from '../DTO/Huella';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { HuellaBack } from '../DTO/huella-back';
import { Documento } from '../DTO/documento';
import { Generalizacion } from '../DTO/generalizacion';
import { Subscription, Observable } from 'rxjs';
import { ParametrosEscaner } from '../DTO/parametros-escaner';
import { LoginService } from '../services/HttpServices/login.service';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { HttpClient } from '@angular/common/http';
//IMPORT PARA PRIMENG STEPS
import {MenuItem} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FormTelefonoComponent } from '../dynamicDialog/form-telefono/form-telefono.component';
import { Email } from '../DTO/email';
import { FormMailComponent } from '../dynamicDialog/form-mail/form-mail.component';

import { XFSMessageTypeEnum } from '../services/huella/interfaces/XFSMessageTypeEnum';
import { WebsocketService2 } from '../services/huella/websocket2.service';
import { XfsApiService } from '../services/huella/xfs-api.service';
import { FingerPreviewComponent } from '../finger-preview/finger-preview.component';
import { isNullOrUndefined } from 'util';
import { WebsocketService } from '../services/websocket.service';
import { HuellaService } from '../services/HttpServices/huella.service';

@Component({
  selector: 'app-enrolamiento',
  templateUrl: './enrolamiento.component.html',
  providers: [DialogService],
  styleUrls: ['./enrolamiento.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class EnrolamientoComponent implements OnInit {

  @ViewChild("fingerPreview", {static:false})
  fingerPreview : FingerPreviewComponent;

  public aplicacion: string = 'PORTALCLIENTES';
  public mostrarMetdo = false;
  public mostrarForm = true;
  public sucursal: string;
  public currentCliente: Cliente = null;
  protected subscripciones: Subscription[] = [];
  protected subscripcionId: Subscription = null;


  public opcionesDomicilios: SelectItem[] = [];
  public opcionesTelefonos: SelectItem[] = [];
  public opcionesMails: SelectItem[] = null;
  public currentDedo = 0;
  public dedos = ['PULGAR_IZQUIERDO', 'INDICE_IZQUIERDO', 'PULGAR_DERECHO', 'INDICE_DERECHO', 'MAYOR_IZQUIERDO', 'MAYOR_DERECHO', 'ANULAR_IZQUIERDO', 'ANULAR_DERECHO', 'MENOR_IZQUIERDO', 'MENOR_DERECHO'];
  public arrayAcciones = [];
  public parametrosBiometricos: ParametrosEscaner;
  public documento: Documento;
  public idCliente: string;

  public mail: Email;
  public direccion: Domicilio;
  public tituloDireccion: string;
  public codigoPostal: string;
  public direccionLegal: Domicilio;
  public telefono: Telefono;
  public cuil: string;

  public currentCaptura = 0;
  public capturas = new Array();
  public dedosFallados = new Array();
  public generalizaciones: Generalizacion[] = new Array();

  public escaneando = false;
  public estaCompleto = false;
  public cancelando = false;
  public setearImagen = false;
  public currentCalidad = 0;
  public errores = 0;
  public enPasoFinal = false;

  public noCapturable: boolean = false;
  public causasNoCapturable: SelectItem[] = [{value: 'AMPUTADA', label: 'Amputada'}, {value: 'IMPOSIBLE_TOMAR', label: 'Imposible tomar'}];
  public causaNoCapturable;

  public currentEndpoint: string = null;
  public alreadyConfirmedLastSkip: boolean = false;
  public accion = '';

  //caso sin telefono
  public codArea: string;
  public numero: string;
  public optionsTipoTelefono: SelectItem[] = [{value: 'FIJO', label: 'Fijo'}, {value: 'CELULAR', label: 'Celular'}];
  public tipoTelefono: string = this.optionsTipoTelefono[0].value;

  public estaListoEnrolar = false;
  public formStatus = {
    closed: false,
    closing: false,
    opened: true,
    opening: false
  };
  public enrolamientoStatus = {
    closed: true,
    closing: false,
    opened: false,
    opening: false
  };
  public mensajeHuellaCapturadaStatus = {
    abrirMensajeScan: false,
    cerrarMensajeScan: true,
  }
  public confirmacionStatus = {
    closed: true,
    closing: false,
    opened: false,
    opening: false
  };
  public mostrarPreview = false;
  public currentImagenDedo: string = null;
  public currentPreviewEscaner: string = null;
  protected currentScan: Subscription = null;
  public esEnrolamiento: boolean;
  protected fallbackURL: string =  '/biometria';

  public esRecaptura: boolean;
  public maximaLongitudNumero: number;
  //Boolean para deshabilitar el boton del form
  public disabledCodigoArea:boolean;
  public disabledNumero:boolean;

  //PRIMENG STEPS
  public steps: MenuItem[];
  public activeIndex: number;

  //Boolean para ultimo STEP
  public esConfirmacionEnrolamiento:boolean;

  //Control para visor de lector de huellas
  public primeraToma: boolean = true;
  public usarIndicaciones: boolean = false;
  public sinIndicaciones: boolean = false;

  constructor(  protected consultasService: ConsultasService, protected router: Router,
                protected errorService: ErrorService,
                protected messageService: MessageService, protected activeRoute: ActivatedRoute,
                protected loginService: LoginService,
                protected confirmationService: ConfirmationService,
                public http: HttpClient,
                public dialogService: DialogService, 
                private websocketService: WebsocketService2,
                private xfsService : XfsApiService,
                private huellaService: HuellaService,
                private servicioWebSocket: WebsocketService,) {}



  ngOnInit(): void {
    this.websocketService.fingerScannerEvent.subscribe(
      wsEvent => {
          if (!isNullOrUndefined(this.fingerPreview)) {
          if (wsEvent.type == XFSMessageTypeEnum.PREVIEW) {
              this.fingerPreview.updateState(wsEvent);
          } else {
              this.fingerPreview.queueState(wsEvent);
          }
          }
      }
    );
    //PRIMENG STEPS
    if (sessionStorage.getItem('rol') === 'CAJA_SEGURIDAD') {
      this.aplicacion = 'CAJASEG';
    }
    this.activeIndex = 0;
    this.steps= [
      {label: 'Datos',
      command: (event: any) => {
        this.activeIndex = 0;
    }
    },
      {label: 'Enrolamiento',
      command: (event: any) => {
        this.activeIndex = 1;
    }
  },

      {label: 'Confirmación',
      command: (event: any) => {
        this.activeIndex = 2;
    }
  }
    ];
    this.subscripciones.push(
      this.loginService.getSucursal().subscribe(success => {
        this.sucursal = success;
      })
    )
    this.subscripciones.push(
      this.activeRoute.url.subscribe(success => {
        if (this.currentEndpoint == null || this.currentEndpoint === success[1].path){
          this.currentEndpoint = success[1].path;
        }
        else{
          this.router.navigate([this.fallbackURL]);
        }
      })
    );
    this.esRecaptura = false;
    this.generalizaciones = [];
    this.capturas = [];
    this.dedosFallados = [];
    this.currentDedo = 0;
    this.currentCaptura = 0;
    this.currentCalidad = 0;
    this.escaneando = false;
    this.estaCompleto = false;
    this.noCapturable = false;
    this.disabledCodigoArea = false;
    this.disabledNumero = false;
    this.maximaLongitudNumero = 8;
    this.esConfirmacionEnrolamiento = false;
    this.consultasService.getParametros().subscribe(success => {
      this.parametrosBiometricos = success;
    });
    this.xfsService.cancelScanFingerprint().subscribe(success => {
    }, 
    error => {
      this.huellaService.cancelarEscaneo().subscribe()
    }
    );
    this.subscripciones.push(this.consultasService.getCurrentIdObservable().subscribe(success2 => {
      if (success2 == null){
        this.router.navigate([this.fallbackURL]);
        this.opcionesDomicilios = null;
      }else{
        if(this.subscripcionId){
          this.subscripcionId.unsubscribe();
        }
        this.subscripciones.push(this.consultasService.getCurrentClienteObservable().subscribe(success => {
          if (success == null && success2 != null && !this.estaListoEnrolar) {
            this.consultasService.getDetalleCliente(success2).subscribe(success =>{
              //Agregar domicilio y telefono al cliente actual.
            });
          }
          else if(success && success2){
            //Agregar domicilio y telefono al cliente actual.
            if((!success.domicilios && !success.telefonos) || (success.domicilios.length <= 0 && success.telefonos.length <= 0)){
              this.consultasService.getDomicilioYTelefono(success)
              .subscribe(domytel=>{
                 this.setClient(success, success2);
                 this.esEnrolamiento = !success2.perfil_biometrico;
                 this.currentCliente.domicilios = domytel.domicilios;
                 this.currentCliente.telefonos = domytel.telefonos;
                 this.cuil = this.currentCliente.cuil;
                const domicilios: SelectItem[] = new Array();
                this.opcionesDomicilios = domicilios;
                const telefonos: SelectItem[] = new Array();
                this.currentCliente.telefonos.forEach(telefono => {
                  let titulo = telefono.codigoArea + '-' + telefono.numero;
                  telefonos.push({label: titulo,
                  value: telefono});
                });
                let nuevosMails: SelectItem[] = new Array();
                this.currentCliente.emails.forEach(mail => {
                  nuevosMails.push({label: mail.direccion, value: mail});
                })
                this.opcionesMails = nuevosMails;
                if(this.opcionesMails.length > 0){
                  this.mail = this.opcionesMails[0].value;
                }
                this.currentCliente.domicilios.forEach(domicilio => {
                  const titulo = (domicilio.provincia_descripcion ? (domicilio.provincia_descripcion + ', ' + domicilio.localidad_descripcion + ', ') : '') + domicilio.calle +
                  ' ' + domicilio.numero + ' ' + domicilio.piso + ' ' + domicilio.departamento;
                  domicilios.push({label: titulo,
                    value: domicilio});
                  });
                  this.opcionesTelefonos = telefonos;
                  if (!this.opcionesDomicilios.some(domicilio => {
                    if (domicilio.value.legal === true) {
                      if(domicilio.value.codigoPostal == null){
                        this.errorService.setMessage('warn', 'Portal de Clientes', 'Por favor ingrese un codigo postal');
                      }
                      this.tituloDireccion = domicilio.label;
                      this.codigoPostal = domicilio.value.codigoPostal;
                      this.direccion = domicilio.value;
                      this.direccionLegal = this.direccion;
                      return true;
                    }
                  })){
                    this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El cliente no puede ser enrolado, no tiene domicilio legal o codigo postal', '0'));
                    this.volverBio();
                  }
                  if(this.opcionesTelefonos.length > 0){
                    this.telefono = this.opcionesTelefonos[0].value;
                  }
                  else{
                    this.errorService.setMessage('info', 'Portal de Clientes', 'El cliente no tiene número, es necesario que ingrese uno nuevo');
                  }
                },error=>{
                });
              }else{
                this.setClient(success, success2);
                this.esEnrolamiento = !success2.perfil_biometrico;
                const domicilios: SelectItem[] = new Array();
                this.opcionesDomicilios = domicilios;
                const telefonos: SelectItem[] = new Array();
                this.currentCliente.telefonos.forEach(telefono => {
                  let titulo = telefono.codigoArea + '-' + telefono.numero;
                  telefonos.push({label: titulo,
                  value: telefono});
                });
                let nuevosMails: SelectItem[] = new Array();
                this.currentCliente.emails.forEach(mail => {
                  nuevosMails.push({label: mail.direccion, value: mail});
                })
                this.opcionesMails = nuevosMails;
                if(this.opcionesMails.length > 0){
                  this.mail = this.opcionesMails[0].value;
                }
                this.currentCliente.domicilios.forEach(domicilio => {
                  console.log('DOMICILIO',domicilio);

                  const titulo = (domicilio.provincia_descripcion ? (domicilio.provincia_descripcion + ', ' + domicilio.localidad_descripcion + ', ') : '') + domicilio.calle +
                  ' ' + domicilio.numero + ' ' + domicilio.piso + ' ' + domicilio.departamento;
                  domicilios.push({label: titulo,
                    value: domicilio});
                  });
                  this.opcionesTelefonos = telefonos;
                  if (!this.opcionesDomicilios.some(domicilio => {
                    if (domicilio.value.legal === true) {
                      if(domicilio.value.codigoPostal == null){
                        this.errorService.setMessage('warn', 'Portal de Clientes', 'Por favor ingrese un codigo postal');
                      }
                      this.tituloDireccion = domicilio.label;
                      this.codigoPostal = domicilio.value.codigoPostal;
                      this.direccion = domicilio.value;
                      this.direccionLegal = this.direccion;
                      return true;
                    }
                  })){
                    this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'El cliente no puede ser enrolado, no tiene domicilio legal o codigo postal', '0'));
                    this.volverBio();
                  }
                  if(this.opcionesTelefonos.length > 0){
                    this.telefono = this.opcionesTelefonos[0].value;
                  }

              }

          }
          if(success2.perfil_biometrico){
            this.accion = "actualizar";
            this.esEnrolamiento = false;
          }
          else{
            this.accion = "enrolar";
            this.esEnrolamiento = true;
          }
        }));
        this.subscripcionId = this.subscripciones[this.subscripciones.length-1];

      }
    }));
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      if (success.status === "NO_DEVICE"){
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes',
          'El escaner pareciera no estar conectado', '0'));
      }
    }, error => {
      this.huellaService.verificarConexionBiometrico().subscribe(success => {
        if (success === false){
          this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes',
            'El escaner pareciera no estar conectado', '0'));
        }
      }, error => {
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'El escaner pareciera no estar conectado', '0'));
      });
      this.preview()
    });
  }

  protected setClient(cliente: Cliente, idCliente: IdentificacionCliente) {
    this.currentCliente = cliente;
    this.documento = {
      numero: idCliente.numero_documento,
      pais: idCliente.pais_documento,
      tipo: idCliente.tipo_documento
    };
    this.idCliente = idCliente.id_persona;
  }

  public volverBio(){
    this.router.navigate([this.fallbackURL]);
  }

  public confirmarForm(){

    if(this.direccionLegal.codigoPostal == null){
      if(this.codigoPostal != null && this.codigoPostal.length > 0){
        this.direccionLegal.codigoPostal = this.codigoPostal;
      }
      else{
        this.errorService.setMessage('warn', 'Portal de Clientes', 'Por favor, ingrese un codigo postal');
        return;
      }
    }

    if(this.opcionesTelefonos.length > 0){

      this.formStatus.closing = true;
      this.formStatus.opened = false;
      this.formStatus.opening = false;
      this.activeIndex = 1;

      setTimeout(() => {
        this.formStatus.closed = true;
        this.enrolamientoStatus = {
          closed: false,
          closing: false,
          opened: true,
          opening: true
        };
      }, 500);
    }
    else{
      this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'Por favor, agregue un teléfono para continuar', '0'));
    }
}

  public volverForm(){

    this.enrolamientoStatus.closing = true;
    this.enrolamientoStatus.opened = false;
    this.enrolamientoStatus.opening = false;
    this.activeIndex = 0;


    setTimeout(() => {
      this.generalizaciones = [];
      this.capturas = [];
      this.dedosFallados = [];
      this.arrayAcciones = [];
      this.currentDedo = 0;
      this.currentCaptura = 0;
      this.currentCalidad = 0;
      this.escaneando = false;
      this.estaCompleto = false;
      this.noCapturable = false;
      this.estaListoEnrolar = false;

      this.enrolamientoStatus.closed = true;
      this.formStatus = {
        closed: false,
        closing: false,
        opened: true,
        opening: true
      };
    }, 500);
  }

  public navegarHuellas(valor: number){
    this.esRecaptura = false;
    this.currentDedo += valor;
    this.causaNoCapturable = null;
    if(this.capturas[this.currentCaptura]){
      this.capturas[this.currentCaptura] = null;
    }
  }

  public confirmarEnrolamiento(){
    this.esConfirmacionEnrolamiento = true;
    this.enrolamientoStatus.closing = true;
    this.enrolamientoStatus.opened = false;
    this.enrolamientoStatus.opening = false;
    this.activeIndex = 2;
    setTimeout(() => {
      this.enrolamientoStatus.closed = true;
        this.confirmacionStatus = {
          closed: false,
          closing: false,
          opened: true,
          opening: true
        };
      }, 500);
  }


  public volverEnrolamiento(){
    this.confirmacionStatus.closing = true;
    this.confirmacionStatus.opened = false;
    this.confirmacionStatus.opening = false;
    this.activeIndex = 1;


    setTimeout(() => {
      this.generalizaciones = [];
      this.capturas = [];
      this.dedosFallados = [];
      this.arrayAcciones = [];
      this.currentDedo = 0;
      this.currentCaptura = 0;
      this.currentCalidad = 0;
      this.escaneando = false;
      this.estaCompleto = false;
      this.noCapturable = false;
      this.estaListoEnrolar = false;

      this.confirmacionStatus.closed = true;
      this.enrolamientoStatus = {
        closed: false,
        closing: false,
        opened: true,
        opening: true
      };
    }, 500);
  }
  public cancelarEnrolamiento(){
    this.confirmacionStatus.closing = true;
    this.confirmacionStatus.opened = false;
    this.confirmacionStatus.opening = false;
    this.activeIndex = 0;

    setTimeout(() => {
      this.generalizaciones = [];
      this.capturas = [];
      this.dedosFallados = [];
      this.arrayAcciones = [];
      this.currentDedo = 0;
      this.currentCaptura = 0;
      this.currentCalidad = 0;
      this.escaneando = false;
      this.estaCompleto = false;
      this.noCapturable = false;
      this.estaListoEnrolar = false;

      this.confirmacionStatus.closed = true;
      this.formStatus = {
        closed: false,
        closing: false,
        opened: true,
        opening: true
      };
    }, 500);
  }

  public preview() {
    let ignoreFirstImage = true;
    this.subscripciones.push(
      this.servicioWebSocket.getImagenHuella().subscribe((imagen) => {
        if(!ignoreFirstImage){
          this.currentPreviewEscaner = imagen;
        }
        else{
          ignoreFirstImage = false;
        }
      })
    );
  }


  public escanear(){
    this.escaneando = true;
    this.cancelando = false;
    this.estaCompleto = false;
    this.xfsService.cancelScanFingerprint().subscribe(
      success => {
       this.beginFingerprintRecognition()
      }, 
      error => {
        this.escanearPreviewSinIndicaciones();
      }
      );
  }

  escanearPreviewSinIndicaciones(){
    setTimeout(()=>{
      this.mostrarPreview = true;
      this.sinIndicaciones = true;
    }, 1000)
    this.currentScan = this.huellaService.escanearHuella(this.dedos[this.currentDedo]).subscribe(success => {

      if (Number.parseInt(success.nfiq, 10) <= this.parametrosBiometricos.maxValorCalidadHuella && success.status !== 'NOK'){
        this.currentCalidad = 6 -  Number.parseInt(success.nfiq, 10);
        const huellaNueva: HuellaBack = new HuellaBack(success, 'DESCONOCIDO', this.dedos[this.currentDedo], 'TOMADA');
        if (this.capturas[this.currentCaptura] == null) {
          this.capturas[this.currentCaptura] = [];
        }
        this.capturas[this.currentCaptura].push(huellaNueva);
        this.currentImagenDedo = 'data:image/png;base64,' + success.wsqPng;
        this.mostrarPreview = false;
        this.sinIndicaciones = false;
        this.mensajeHuellaCapturadaStatus = {
          abrirMensajeScan: true,
          cerrarMensajeScan: false,
        }
        setTimeout(() => {
          this.mensajeHuellaCapturadaStatus = {
            abrirMensajeScan: false,
            cerrarMensajeScan: true,
          }
        }, 500)
        if (this.capturas[this.currentCaptura].length >= this.parametrosBiometricos[this.dedos[this.currentDedo].toLowerCase()]){
          this.generalizar();
        }
        else{
          this.escanear();

        }
      }
      else if(success.status !== 'NOK') {
        this.mostrarPreview = false;
        this.sinIndicaciones = false;
        this.escaneando = false;
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Insuficiente calidad de captura, intentar de nuevo', '0'));
      }
      else{
        this.mostrarPreview = false;
        this.sinIndicaciones = false;
        if (!this.cancelando){
          this.huellaService.cancelarEscaneo().subscribe(success => {
            this.escaneando = false;
          });
          this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
        }
        else {
          this.cancelando = false;
        }
      }
    }, error => {
        this.mostrarPreview = false;
        this.sinIndicaciones = false;
        setTimeout(() => {
          this.escaneando = false;
        }, 2000);
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Fallo la captura, por favor intentar de nuevo', '0'));
    });

  }

 // async beginFingerprintRecognition(){
  beginFingerprintRecognition(){
    setTimeout(()=>{
      this.mostrarPreview = true;
      this.usarIndicaciones = true
    }, 1000)
    
    if (!isNullOrUndefined(this.fingerPreview)) {
      this.fingerPreview.init();
    }
    this.xfsService.scanFingerprintEncryptedWithPreview('', 15, 3, 30, sessionStorage.getItem('encryptionKey')).subscribe(
        sData => {
          if (sData.status == "OK") {
            const huella: Huella = {
              status: sData.status,
              descripcionStatus: '',
              wsqBase64: sData.wsq,
              wsqPng: sData.wsq,
              templateBase64: null,
              nfiq: ''
            }
            const huellaNueva: HuellaBack = new HuellaBack(huella, 'DESCONOCIDO', this.dedos[this.currentDedo], 'TOMADA');
            if (this.capturas[this.currentCaptura] == null) {
              this.capturas[this.currentCaptura] = [];
            }
            
            this.capturas[this.currentCaptura].push(huellaNueva);
            this.currentImagenDedo = this.getPreviewDedoActual();
            //this.currentImagenDedo = 'data:image/png;base64,' + sData.wsq;
            this.mostrarPreview = false;
            this.usarIndicaciones = false
            this.mensajeHuellaCapturadaStatus = {
              abrirMensajeScan: true,
              cerrarMensajeScan: false,
            }
            setTimeout(() => {
              this.mensajeHuellaCapturadaStatus = {
                abrirMensajeScan: false,
                cerrarMensajeScan: true,
              }
            }, 500)
            if (this.capturas[this.currentCaptura].length >= this.parametrosBiometricos[this.dedos[this.currentDedo].toLowerCase()]){
              this.primeraToma = true;
              this.generalizar();
            }
            else{
              this.primeraToma = false;
              this.escanear();
    
            }
          }         
          else if(sData.status == 'TIMEOUT') {
            this.mostrarPreview = false;
            this.sinIndicaciones = false;
            this.escaneando = false;
            this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Insuficiente calidad de captura, intentar de nuevo', '0'));
          }
          else{
            this.mostrarPreview = false;
            this.sinIndicaciones = false;
            if (!this.cancelando){
              this.huellaService.cancelarEscaneo().subscribe(success => {
                this.escaneando = false;
              });
              this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
            }
            else {
              this.cancelando = false;
            }
          }

        },
        err => {
          this.usarIndicaciones = false
          console.log(err)
        }
    );
  } 

  protected generalizar(){
    if(this.capturas[this.currentCaptura].length < 3) {
      setTimeout(()=>{
        this.estaCompleto = true;
        this.generalizaciones[this.currentCaptura] = {template: null, dedo: this.dedos[this.currentDedo]};

        if(this.arrayAcciones.length > this.currentDedo ){
          const currentIndice = this.arrayAcciones[this.currentDedo].indice;
          if(this.arrayAcciones[this.currentDedo].seCapturo){
            this.generalizaciones.splice(currentIndice, 1);
            this.capturas.splice(currentIndice, 1);
            for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
              if (this.arrayAcciones[x].seCapturo) {
                this.arrayAcciones[x].indice--
              }
            }
          }
          else{
            this.dedosFallados.splice(currentIndice, 1)
            this.currentCaptura++;
            for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
              if (!this.arrayAcciones[x].seCapturo) {
                this.arrayAcciones[x].indice--
              }
            }
          }
        }
        else{
          ++this.currentCaptura;
        }

        this.arrayAcciones[this.currentDedo] = ({seCapturo: true, indice: this.currentCaptura - 1});
        this.esRecaptura = false;
        this.escaneando = false;
        if (this.generalizaciones.length >= this.parametrosBiometricos.cantMinimaDedos){
          this.estaCompleto = true;
          this.estaListoEnrolar = true;
        }
        this.errores = 0;
        this.currentCalidad = 0;
        this.currentImagenDedo = null;
      }, 3000);
    }
    else{
      this.consultasService.generalizarHuellas(this.capturas[this.currentCaptura], this.documento, this.idCliente).subscribe(success => {
        const template = success.template;
        this.generalizaciones[this.currentCaptura] = {template, dedo: this.dedos[this.currentDedo]};

        if(this.arrayAcciones.length > this.currentDedo ){
          const currentIndice = this.arrayAcciones[this.currentDedo].indice;
          if(this.arrayAcciones[this.currentDedo].seCapturo){
            this.generalizaciones.splice(currentIndice, 1);
            this.capturas.splice(currentIndice, 1);
            for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
              if (this.arrayAcciones[x].seCapturo) {
                this.arrayAcciones[x].indice--
              }
            }
          }
          else{
            this.currentCaptura++;
            this.dedosFallados.splice(currentIndice, 1)
            for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
              if (!this.arrayAcciones[x].seCapturo) {
                this.arrayAcciones[x].indice--
              }
            }
          }
        }
        else{
          this.currentCaptura++;
        }
        this.arrayAcciones[this.currentDedo] = ({seCapturo: true, indice: this.currentCaptura - 1});
        this.esRecaptura = false;
        this.escaneando = false;
        if (this.generalizaciones.length >= this.parametrosBiometricos.cantMinimaDedos){
          this.estaCompleto = true;
          this.estaListoEnrolar = true;
        }
        this.currentImagenDedo = null;
        this.errores = 0;
        this.currentCalidad = 0;
      }, error => {
          this.currentImagenDedo = null;
          this.capturas[this.currentCaptura] = [];
          this.escaneando = false;
          this.errores = 0;
          this.errorService.procesarRespuestaError(error);
      });
    }
  }

  public enrolar(){
    let observable: Observable<any>;
    let selectedTelefono: Telefono;
    if(this.opcionesTelefonos.length <= 0){
      selectedTelefono = {  codigoArea: this.codArea,
                            numero: this.numero,
                            tipo: this.tipoTelefono,
                            operador: null
      }
    }
    else{
      selectedTelefono = this.telefono;
    }
    if(this.esEnrolamiento) {
        observable = this.consultasService.enrolar(this.cuil, this.documento, this.direccionLegal, this.generalizaciones, this.capturas,
          selectedTelefono, this.idCliente, this.dedosFallados, this.aplicacion);
    }
    else{
      observable = this.consultasService.actualizar(this.cuil, this.documento, this.direccionLegal, this.generalizaciones, this.capturas,
        selectedTelefono, this.idCliente, this.dedosFallados, this.aplicacion);
    }
    this.enPasoFinal = true;
    observable.subscribe(success => {
        if(this.esEnrolamiento){
          this.errorService.setMessage('success', 'Enrolado', 'Cliente enrolado correctamente');
        }
        else{
          this.errorService.setMessage('success', 'Modifidicado', 'Cliente modificado correctamente');
        }
        this.subscripciones.forEach(subscripcion => {
          subscripcion.unsubscribe();
        });
        this.consultasService.setCurrentCliente(null, null);
        this.router.navigate([this.fallbackURL]);
      }, error => {
          this.arrayAcciones = [];
          this.capturas = [];
          this.alreadyConfirmedLastSkip = false;
          this.enPasoFinal = false;
          this.estaCompleto = false;
          this.generalizaciones = [];
          this.dedosFallados = [];
          this.escaneando = false;
          this.errores = 0;
          this.currentDedo = 0;
          this.currentCaptura = 0;
          this.activeIndex = 0;
          this.estaListoEnrolar = false;
          this.cancelarEnrolamiento();
          this.errorService.procesarRespuestaError(error);
      });
  }


  public detenerCaptura(){
    this.cancelando = true;
    this.setearImagen = true;
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      this.escaneando = false;
      this.currentImagenDedo = null;
    }, 
    error => {
      this.huellaService.cancelarEscaneo().subscribe(success => {
        this.escaneando = false;
      this.currentImagenDedo = null;
      })
    }
    );
  }



  //alerta al quedarse sin dedos
  public saltear(){
    if(this.dedos.length - (this.currentDedo+1) >= this.parametrosBiometricos.cantMinimaDedos - this.generalizaciones.length){


      if(this.arrayAcciones.length > this.currentDedo ){
        const currentIndice = this.arrayAcciones[this.currentDedo].indice;
        if(this.arrayAcciones[this.currentDedo].seCapturo){
          this.generalizaciones.splice(currentIndice, 1);
          this.capturas.splice(currentIndice, 1);
          for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
            if (this.arrayAcciones[x].seCapturo) {
              this.arrayAcciones[x].indice--
            }
          }
          this.currentCaptura--;
          this.estaListoEnrolar = false;
        }
        else{
          this.dedosFallados.splice(currentIndice, 1)
          for(let x = this.currentDedo; x < this.arrayAcciones.length; x++){
            if (!this.arrayAcciones[x].seCapturo) {
              this.arrayAcciones[x].indice--
            }
          }
        }
      }

      this.dedosFallados.push({dedo: this.dedos[this.currentDedo],  estado_huella: this.causaNoCapturable});
      this.arrayAcciones[this.currentDedo] = ({seCapturo: false, indice: this.dedosFallados.length - 1});
      this.noCapturable = false;
      this.causaNoCapturable = null;
      this.capturas[this.currentCaptura] = null;
      this.esRecaptura = false;
    }
    else{
      this.showConfirm();
    }

  }

  showConfirm() {
    let message = 'Si se omite esta huella el cliente no se podrá ' + this.accion + ' quiere continuar?';
    this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', message, '0'));
    this.alreadyConfirmedLastSkip = true;
  }

  saltearFinal() {
    let mensajeError: Error = null;
    if(this.esEnrolamiento){
      mensajeError = new Error('Portal de Clientes', 'Portal de Clientes', 'El cliente no pudo ser enrolado porque no se pueden procesar la cantidad mínima de dedos requeridos', '0');
    }
    else{
      mensajeError = new Error('Portal de Clientes', 'Portal de Clientes', 'El cliente no pudo ser actualizado porque no se pueden procesar la cantidad mínima de dedos requeridos', '0');
    }

    if(this.arrayAcciones.length > this.currentDedo ){
      const currentIndice = this.arrayAcciones[this.currentDedo].indice;
      if(this.arrayAcciones[this.currentDedo].seCapturo){
        this.generalizaciones.splice(currentIndice, 1);
        this.capturas.splice(currentIndice, 1);
        for(let x = currentIndice; x < this.arrayAcciones.length; x++){
          if (this.arrayAcciones[x].seCapturo) {
            this.arrayAcciones[x].indice--
          }
        }
        this.currentCaptura--;
      }
      else{
        this.dedosFallados.splice(currentIndice, 1)
        for(let x = currentIndice; x < this.arrayAcciones.length; x++){
          if(!this.arrayAcciones[x].seCapturo) {
            this.arrayAcciones[x].indice--
          }
        }
      }
    }

    this.dedosFallados.push({dedo: this.dedos[this.currentDedo],  estado_huella: this.causaNoCapturable});
    this.noCapturable = false;
    this.causaNoCapturable = null;
    this.capturas[this.currentCaptura] = null;
    this.cancelando = true;
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      this.escaneando = false;
    }, 
    error => {
      this.huellaService.cancelarEscaneo().subscribe(success => {
        this.escaneando = false;
      })
    }
    );
    this.activeIndex = 0;
    this.router.navigate([this.fallbackURL]);
    this.errorService.setError(mensajeError);
  }

  ngOnDestroy() {
    this.cancelando = true;
    if(this.currentScan){
      this.currentScan.unsubscribe();
    }
    this.generalizaciones = [];
    this.capturas = [];
    this.dedosFallados = [];
    this.currentDedo = 0;
    this.currentCaptura = 0;
    this.currentCalidad = 0;
    this.escaneando = false;
    this.estaCompleto = false;
    this.noCapturable = false;
    this.subscripciones.forEach(subscripcion => {
      subscripcion.unsubscribe();
    });
  }

  cambioNoCapturar(valor: boolean){
    if(valor){
      this.detenerCaptura();
    }
  }

  public rescanear(){
    this.esRecaptura = true;
    this.escanear();
  }

  public verificarCodigoArea(input:any){
      let codigo = Number(input.key);
      if(Number.isNaN(codigo) && input.key.length == 1){
        input.preventDefault();
      }
  }

  public noEvent(input: any){
    input.preventDefault();
  }

  protected getDigits(numero: string): number{
    return numero.length;
  }
  
  public cambiarTipoTelefono(event:string){
    if(event.length > 4)
      this.maximaLongitudNumero = 10;
    else
      this.maximaLongitudNumero = 8;
    this.numero = '';
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


  getPreviewDedoActual(): string{
    var dedo = this.dedos[this.currentDedo]
    return "trueAssets/huellas-indicaciones/finger.png";
  }
}
