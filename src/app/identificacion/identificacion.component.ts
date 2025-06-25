import { Subscription } from 'rxjs';
import { IdentificacionCliente } from './../DTO/identificacion-cliente';
import { SelectItem } from 'primeng/api';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { HuellaBack } from '../DTO/huella-back';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/HttpServices/login.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { Cliente } from '../DTO/cliente';
import { Caja } from '../DTO/Caja';
import { ParametrosEscaner } from '../DTO/parametros-escaner';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { ErrorResponse } from '../DTO/error-response';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { Huella } from '../DTO/Huella';
import { FingerPreviewComponent } from '../finger-preview/finger-preview.component';
import { isNullOrUndefined } from 'util';
import { WebsocketService2 } from '../services/huella/websocket2.service';
import { XfsApiService } from '../services/huella/xfs-api.service';
import { XFSMessageTypeEnum } from '../services/huella/interfaces/XFSMessageTypeEnum';
import { HuellaService } from '../services/HttpServices/huella.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-identificacion-componente',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.css']
})
export class IdentificacionComponent implements OnInit, OnDestroy {


  public currentImagenDedo: string;
  public currentCalidad: number;
  public currentHuella: HuellaBack;
  public escaneando: boolean;
  public identificando: boolean;
  public cancelando: boolean;
  public esVerificacion: boolean;
  public esIngresoManual: boolean;
  public parametrosBiometricos: ParametrosEscaner;
  public falloVerificacion: boolean;
  public escanCompleto: boolean = false;
  public documentoCliente: string = null;
  private idClienteFalloVerificar = null;
  private errores;
  identificado = false;
  numDoc: number;
  tipoDoc: string;
  pais:string;
  tipoIdentificacion = 'I';
  // clienteIdentificado: IdentificacionCliente;
  clienteCajas: Cliente = new Cliente();
  cajas: Caja[] = null;
  private subscripciones: Subscription[] = [];
  
  public tiposDocs: SelectItem[] = null;
  public paisesOrigen: SelectItem[];
  public enrolarCliente: boolean = false;
  //Boolean para deshabilitar el boton del form
  public disabled:boolean = false;

  @ViewChild("fingerPreview", {static:false})
  fingerPreview : FingerPreviewComponent;

  public tomandoHuella: boolean = false;
  
  constructor( private huellaService: HuellaService,
    private servicioWebSocket: WebsocketService,
    private consultasService: ConsultasService,
    private http: HttpClient,
               private loginService: LoginService,
               private servicioCajas: CajaseguridadService,
               private errorService: ErrorService,
               private ruteador: Router,
               private websocketService: WebsocketService2,
               private xfsService : XfsApiService) { }

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
    this.errores = 0;
    this.falloVerificacion = false;
    this.esIngresoManual = false;
    this.identificado = false;
    this.currentImagenDedo = null;
    this.tomandoHuella = false;
    this.escaneando = false;
    this.identificando = false;
    this.cancelando = false;
    this.currentHuella = null;
    this.currentCalidad = 0;
    this.subscripciones.push(this.consultasService.getCurrentClienteObservable().subscribe(success => {
      console.log('SUCCESS TEST',success);
      
      this.clienteCajas = success;
      if(this.clienteCajas == null){
        this.cajas = null;
        this.identificado = false;
      }
      else{
        this.cargarDatosCajas();
      }
    }))
    this.consultasService.getParametros().subscribe(success => {
      this.parametrosBiometricos = success;
    });

    this.xfsService.cancelScanFingerprint().subscribe(
      success => this.checkearEstadoEscaner(), 
      error => this.checkearEstadoEscaner()
    );

    this.consultasService.getTiposDocs().subscribe(success=>{
      success.sort((a, b) => {
        return a.orden - b.orden;
      });
      const nuevoTipos: SelectItem[] = new Array();
      success.forEach(tipo=>{
        if (tipo.id !== 'CUIT') {
          nuevoTipos.push({label: tipo.id, value: tipo.codigoSoa});
        }
      })
      this.tiposDocs = nuevoTipos;
      this.tipoDoc = this.tiposDocs[0].value;
    }, error => {
      console.log('ERROR TIPODOCS');
      
      this.tiposDocs = [{label: 'DNI', value: '4'}];
      this.tipoDoc = this.tiposDocs[0].value;
    });
    this.consultasService.getPaises().subscribe(success=>{
      const nuevosPaises: SelectItem[] = new Array();
      success.forEach(pais=>{
        nuevosPaises.push({label: pais.descripcion, value: pais.orden.toString()});
      })
      this.paisesOrigen = nuevosPaises;
      this.pais = '80';
    },error=>{
      this.paisesOrigen = [{label: "Argentina", value: 80}]
      this.pais = '80';
    });
  }
  public detenerCaptura(){
    this.cancelando = true;
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      this.escaneando = false;
      this.currentImagenDedo = null;
      this.tomandoHuella = false;
    }, 
    error => {
      this.huellaService.cancelarEscaneo().subscribe(success => {
        this.escaneando = false;
        this.currentImagenDedo = null;
      })
    }
    );
  };
  public rescanear(){
    this.esVerificacion = false;
    this.esIngresoManual = false;
    this.falloVerificacion = false;
    this.escanear();
  };

  private checkearEstadoEscaner(){
    this.xfsService.cancelScanFingerprint().subscribe(success => {
      if (success.status === "NO_DEVICE"){
        this.esIngresoManual = true;
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes',
          'El escaner pareciera no estar conectado', '0'));
      }
    }, error => {
      this.huellaService.verificarConexionBiometrico().subscribe(success => {
        if (success === false){
          this.esIngresoManual = true;
          this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes',
            'El escaner pareciera no estar conectado', '0'));
        }
      }, error => {
        this.esIngresoManual = true;
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Para operar con Biometría debe tener instalado los servicios biométricos', '0'));
      });
  });
  }

  public verificar() {
    if(this.numDoc && this.pais && this.tipoDoc){
      this.consultasService.verificarCliente([this.currentHuella],
      { numero: this.numDoc.toString(),
        pais: this.pais.toString(),
        tipo: this.tipoDoc
      }).subscribe(idCliente => {
        this.numDoc = null;
        this.tipoIdentificacion = 'V';
      }, error => {
        this.falloVerificacion = true;
        try{
          const errorObject: IdentificacionCliente = error;
          if(errorObject.perfil_biometrico === false){
            this.idClienteFalloVerificar = errorObject;
            this.esIngresoManual = true;
            this.documentoCliente = errorObject.numero_documento;
            this.enrolarCliente = true;
          }
        }
        catch (exc){
        }
      });
    }
    else{
      this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese un número de documento", "0"));
    }
  }

  enrolarClienteRapido(){
    this.consultasService.getDetalleCliente(this.idClienteFalloVerificar).subscribe(success => {
      this.cerrarVentanaSesion();
      this.ruteador.navigate(['cajas/biometria']);
    })
  }

  private errorAlEscanear(){
    if(++this.errores >= 3){
      this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'No pudo identificarse correctamente, por favor realizar el ingreso Manual', '0'));
      this.esIngresoManual = true;
      return;
    }
  }

  public escanear(){
    this.xfsService.cancelScanFingerprint().subscribe(
    success => {
     // this.escanearViejoServicio();
      this.escanearNuevoServicio();
    }, 
    error => {
      // this.escanearNuevoServicio();
      this.escanearViejoServicio();
    }
    );
  }

  escanearNuevoServicio(){
    this.escaneando = true;
    this.identificando = true;
    setTimeout(()=>{
      this.tomandoHuella = true;

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
              wsqPng:  sData.wsq,
              templateBase64: null,
              nfiq: ''
            }
            this.escaneando = false;
            this.currentImagenDedo = "trueAssets/huellas-indicaciones/finger.png";            
            this.currentHuella = new HuellaBack(huella, 'DESCONOCIDO', 'DESCONOCIDO', 'TOMADA');
            this.tomandoHuella = false;
            this.consultasService.identificarCliente([this.currentHuella], null).subscribe(idCliente => {
            }, error => {
              this.errorAlEscanear();
              this.identificando = false;
              this.escanCompleto = true;
              this.esVerificacion = true;
              this.currentImagenDedo = null
            });
          }   
          else if(sData.status == 'TIMEOUT') {
            this.tomandoHuella = false;
            this.escaneando = false;
            this.identificando = false;
            this.currentImagenDedo = null
            this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Insuficiente calidad de captura, intentar de nuevo', '0'));
            this.errorAlEscanear();
          }
          else{
            if (!this.cancelando){
              this.xfsService.cancelScanFingerprint().subscribe(success => {
                this.tomandoHuella = false;
                this.escaneando = false;
                this.identificando = false;
                this.currentImagenDedo = null
              });
              this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
              this.errorAlEscanear();
            }
            else {
              this.tomandoHuella = false;
              this.cancelando = false;
              this.identificando = false;
              this.currentImagenDedo = null
            }
          }       
        },
        err => {
          this.tomandoHuella = false;
          this.escaneando = false;
          this.identificando = false;
          this.currentImagenDedo = null
          this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
          this.errorAlEscanear();
        }
      );
  }

  escanearViejoServicio(){
    this.escaneando = true;
    this.identificando = true;
    this.servicioWebSocket.getImagenHuella().subscribe((imagen) => {
      this.currentImagenDedo = imagen;
    });
    this.huellaService.escanearHuella('PULGAR_IZQUIERDO').subscribe(success => {
      if (Number.parseInt(success.nfiq, 10) <= this.parametrosBiometricos.maxValorCalidadHuella && success.status !== 'NOK'){
        this.escaneando = false;
        this.currentCalidad = 6 - Number.parseInt(success.nfiq, 10);
        this.currentHuella = new HuellaBack(success, 'DESCONOCIDO', 'DESCONOCIDO', 'TOMADA');
        console.log([this.currentHuella])
        this.consultasService.identificarCliente([this.currentHuella], null).subscribe(idCliente => {
        }, error => {
          this.errorAlEscanear();
          this.identificando = false;
          this.escanCompleto = true;
          this.esVerificacion = true;
        });
      }
      else if(success.status !== 'NOK') {
        this.escaneando = false;
        this.identificando = false;
        this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Insuficiente calidad de captura, intentar de nuevo', '0'));
        this.errorAlEscanear();
      }
      else{
        if (!this.cancelando){
          this.huellaService.cancelarEscaneo().subscribe(success => {
            this.escaneando = false;
            this.identificando = false;
          });
          this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
          this.errorAlEscanear();
        }
        else {
          this.cancelando = false;
          this.identificando = false;
        }
      }
    }, error => {
      this.escaneando = false;
      this.identificando = false;
      this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Ocurrio un error inesperado con el scaner', '0'));
      this.errorAlEscanear();
    });
  }

  cargarDatosCajas() {
    console.log('THIS CLIENTECAJAS',this.clienteCajas);
    
    if (this.clienteCajas.genero === 'F') {
      this.clienteCajas.generoDesc = 'Femenino';
    } else if (this.clienteCajas.genero === 'M') {
      this.clienteCajas.generoDesc = 'Masculino';
    }
    this.identificado = true;
    this.servicioCajas.consultaListadoCajas(this.clienteCajas.tipo_documento, this.clienteCajas.numero_documento, this.clienteCajas.pais_documento).subscribe(listaCajas => {
        this.cajas = listaCajas;
    });
  }

  buscarDeNuevo(){
    this.currentCalidad = 0;
    this.esIngresoManual = false;
    this.esVerificacion = false;
    this.falloVerificacion = false;
    this.documentoCliente = null;
    this.errores = 0;
    this.xfsService.cancelScanFingerprint().subscribe(success => this.checkearEstadoEscaner(), error => this.checkearEstadoEscaner());
    this.enrolarCliente = false;
    this.escanCompleto = false;
    this.currentImagenDedo = null;
    this.tomandoHuella = false;
    this.currentHuella = null;
    this.cajas = null;
    this.identificado = false;
    this.identificando = false;
    this.consultasService.setCurrentCliente(null, null);
  }

  ingresoManual() {
    if(this.numDoc && this.tipoDoc && this.pais){
      this.tipoIdentificacion = 'M';
      this.consultasService.buscarCliente(this.tipoDoc, this.numDoc.toString(), this.pais.toString())
        .subscribe(() => this.numDoc = null);
    }
    else{
      this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese un número de documento", "0"));
    }
  }

  ngOnDestroy(): void {
    this.subscripciones.forEach(subscripcion => {
      subscripcion.unsubscribe();
    })
  }

  cerrarVentanaSesion(){
    this.enrolarCliente = false;
    this.documentoCliente = null;
  }
  public verificarInput(input:any){
    let dni = Number(input);
    if(!Number(input) || dni < 0 || isNaN(dni) || input[0] == '+' || !Number.isInteger(dni) || input[input.length-1] == '.'){
      this.disabled = true;
        this.errorService.setError(new Error('Portal de Clientes', 'Portal de Clientes', 'Por favor, ingrese un numero de documento valido.', '0'));
    }else{
      this.disabled = false;
    }
  }
}
