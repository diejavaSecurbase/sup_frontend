import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { SelectItem } from 'primeng/api';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { EnrolamientoFacialDTO } from '../DTO/EnrolamientoFacialDTO';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { Documento } from '../DTO/documento';
import { LoginService } from '../services/HttpServices/login.service';
import { FotoEnrolamiento } from '../DTO/fotos-enrolamiento';
import { AuthHistoryList } from '../DTO/authHistory';

@Component({
  selector: 'app-bio-facial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    TableModule,
    MessageModule
  ],
  templateUrl: './bio-facial.component.html',
  styleUrls: ['./bio-facial.component.css'],
})
export class BioFacialComponent implements OnInit {
  numDoc: number;
  tipoDoc: string;
  pais: string;
  sucursal: string;
  public disabled: boolean = false;
  public tiposDocs: SelectItem[] = null;
  public paisesOrigen: SelectItem[];
  public currentCliente: EnrolamientoFacialDTO = null;
  public currentId: IdentificacionCliente = null;
  public nameSubname: string;
  displayModal: boolean;
  imgsBase: FotoEnrolamiento[];
  authHistoryList: AuthHistoryList[];
  showTable = false;
  displayModalPictureRegistry: boolean;
  displayModalDeleteEnrollment: boolean;
  imageRegistry: string;

  constructor(
    private consultas: ConsultasService,
    private errorService: ErrorService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.nameSubname = null;
    this.paisesOrigen = [{ label: 'Argentina', value: 80 }];
    this.pais = '80';
    this.consultas.setCurrentClienteFacial(null, null);

    this.consultas.getCurrentClienteFacialObservable().subscribe(
      (success) => {
        this.currentCliente = success;        
      },
      (error) => {}
    );
    this.consultas.getCurrentIdObservable().subscribe((success) => {
      this.currentId = success;
    });

    this.consultas.getTiposDocs().subscribe(
      (success) => {
        success.sort((a, b) => {
          return a.orden - b.orden;
        });
        let nuevoTipos: SelectItem[] = new Array();
        success.forEach((tipo) => {
          if (tipo.id != 'CUIT') {
            nuevoTipos.push({
              label: tipo.id,
              value: tipo.codigoSoa,
            });
          }
        });
        this.tiposDocs = nuevoTipos;
        this.tipoDoc = this.tiposDocs[0].value;
      },
      (error) => {
        this.tiposDocs = [{ label: 'DNI', value: '4' }];
        this.tipoDoc = this.tiposDocs[0].value;
      }
    );
  }

  public buscar() {
    if (this.numDoc && this.tipoDoc && this.pais) {
      this.consultas
        .getClienteEnrollFacial(this.tipoDoc, this.numDoc, this.pais)
        .subscribe(
          (success) => {
            if (!success || !success.estado_enrolamiento || success.estado_enrolamiento == 'PREINITIALIZED') {
              this.errorService.setError(
                new Error(
                  'Portal de clientes',
                  'Portal de Clientes',
                  'No hay información biométrica para los datos ingresados.',
                  '0'
                )
              );
              this.buscarAgain();
            };
            if(success.estado_enrolamiento =='INITIALIZED') {
              this.errorService.setError(
                new Error(
                  'VALIDACIÓN MANUAL',
                  'Portal de Clientes',
                  'En este momento no se puede realizar la validación manual. Por favor intente más tarde.',
                  'warn'
                )
                );
            }
          },
          (error) => {
            this.numDoc = null;
          }
        );
    } else {
      this.errorService.setError(
        new Error(
          'Portal de clientes',
          'Portal de Clientes',
          'Por favor ingrese un número de documento',
          '0'
        )
      );
    }
  }

  public buscarAgain() {
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.authHistoryList = null;
    this.showTable = null;
    this.displayModalDeleteEnrollment = false;
    this.nameSubname = null;
    this.consultas.setCurrentClienteFacial(null, null);
  }

  public validarManual() {
    const doc: Documento = {
      numero: this.numDoc.toString(),
      pais: this.pais,
      tipo: this.tipoDoc,
    };
    this.loginService.getSucursal().subscribe((suc) => (this.sucursal = suc));

    this.consultas
      .patchValidarManual(
        this.currentCliente.id_enrolamiento,
        this.currentCliente.id_persona,
        this.sucursal,
        doc
      )
      .subscribe(
        (success) => {
          this.errorService.setMessage(
            'success',
            'VALIDADO CORRECTAMENTE',
            'Se realizo la validacion manual de forma exitosa'
          );
          if (this.numDoc && this.tipoDoc && this.pais) {
            this.buscar();
          }
        },
        (error) => {
          this.errorService.setError(
            new Error(
              'VALIDACION MANUAL',
              'Portal de Clientes',
              'No se pudo realizar la validacion manual, intentelo mas tarde.',
              '0'
            ),
            'error'
          );
        }
      );
  }

  showPics() {
    this.consultas
      .getFotosEnrolamiento(
        this.currentCliente.id_enrolamiento,
        this.currentCliente.identificacion_digital.id_tramite
      )
      .subscribe(
        (success) => {
          this.imgsBase = success;
          this.displayModal = true;
        },
        (error) => {
          this.errorService.setError(
            new Error(
              'FOTOS',
              'Portal de Clientes',
              'No se pudieron recuperar las fotos.',
              '0'
            ),
            'error'
          );
        }
      );
  }

  showHistory() {
    this.consultas
      .getAuthHistory(
        this.currentCliente.id_persona
      )
      .subscribe(
        (success) => {
          if (success.response.auditorias_autenticacion.length > 0) {
            this.authHistoryList = success.response.auditorias_autenticacion.reverse();
            this.authHistoryList.forEach(res => this.setPercentageFormat(res));
          } else {
            this.errorService.setMessage(
              'warn',
              'SIN REGISTROS',
              'Aun no cuenta con registros'
            );
          }
          this.showTable = true;
        },
        (error) => {
          this.errorService.setError(
            new Error(
              'Historial',
              'Portal de Clientes',
              'No se pudo recuperar el historial de autenticaciones.',
              '0'
            ),
            'error'
          );
        }
      );
  }

  setPercentageFormat(res: AuthHistoryList){
    res.similitud_plantilla_facial_extendida = this.validatePercentageFormat( res.similitud_plantilla_facial_extendida);
    res.similitud_mejor_imagen_facial = this.validatePercentageFormat(res.similitud_mejor_imagen_facial);
    return res;
  }

  validatePercentageFormat(res: number){
   if(res != null ) {
    return Number((res * 100).toFixed(2));
   
   }
    return null;
  }

  getAuthHistoryPicture(item) {
    this.consultas
    .getPictureByHistoryItem(
      item.id
    )
    .subscribe(
      (success) => {
        this.imageRegistry = this.builtImageToShow(success.response);
        this.displayModalPictureRegistry = true;
      },
      (error) => {
        this.errorService.setError(
          new Error(
            'FOTO',
            'Portal de Clientes',
            'No se pudo recuperar la imagen del registro.',
            '0'
          ),
          'error'
        );
      }
    );
  }

  builtImageToShow(img: string): string {
    const buildedImage = 'data:image/png;base64,'+img;
    return buildedImage;
  }
  borrarEnrolamiento(){
    this.displayModalDeleteEnrollment = true; 
    this.nameSubname = this.currentCliente.cliente.nombre + ' ' + this.currentCliente.cliente.apellido;
}
cancelarBajaEnrolamiento(){
  this.displayModalDeleteEnrollment = false;
  this.nameSubname = null;
}
confirmarBajaEnrolamiento(){
  const doc: Documento = {
    numero: this.currentCliente.cliente.numero_documento,
    pais: this.currentCliente.cliente.pais_documento,
    tipo: this.currentCliente.cliente.tipo_documento,
  };
  this.consultas.deleteEnrolamientoFacial(this.currentCliente.id_enrolamiento.toString(), doc)
  .subscribe(
    (success) => {
      this.cancelarBajaEnrolamiento();
      this.errorService.setMessage(
        'success',
        'Portal de Clientes',
        'Se eliminó el enrolamiento facial de forma exitosa'
      );
      if (this.numDoc && this.tipoDoc && this.pais) {
        this.buscar();
      }
    },
    (error) => {
      this.errorService.setError(
        new Error(
          'Borrar Enrolamiento Facial',
          'Portal de Clientes',
          'No se pudo eliminar el enrolamiento facial, intentelo más tarde.',
          '0'
        ),
        'error'
      );
      this.cancelarBajaEnrolamiento();
    }
  );
}
}