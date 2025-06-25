import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { SelectItem } from 'primeng/api';
import { Error } from '../DTO/error';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { Cliente } from '../DTO/cliente';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Observable } from 'rxjs';
import { GeneralLoadsService } from '../services/general-loads.service';

@Component({
  selector: 'app-baja-biometrica-huella',
  templateUrl: './baja-biometrica-huella.component.html',
  styleUrls: ['./baja-biometrica-huella.component.css']
})
export class BajaHuellaBiometricaComponent implements OnInit {

    public aplicacion: string = 'PORTALCLIENTES';
    private fallbackURL: string ='/baja-biometrica-huella/baja';
  
    public paisesOrigen: SelectItem[];
    pais: string;
    public tiposDocs: SelectItem[] = null;
    tipoDoc: string;
    numDoc: number;
    public disabled: boolean = false;
    numGestar: string;
    motivoBaja: string;
  
    public currentCliente: Cliente = null;
    public currentId: IdentificacionCliente = null;
     
    isLoading = true;

    menuBajaBiometricaActive:boolean;
    showModalBaja:boolean;
   
  
    constructor(private consultas: ConsultasService, private errorService: ErrorService, private validacionesGenerales: GeneralLoadsService) { }
  
    ngOnInit(): void {
  
      this.currentCliente = null;
      this.currentId = null;
      this.numDoc = null;    
      this.numGestar = null;
      this.motivoBaja = "Por Gestar";
  
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

    
      backToButtons() {
      this.currentCliente = null;
      this.currentCliente = null;
      this.currentId = null;
      this.numDoc = null;
      this.numGestar = null;
      this.consultas.setCurrentCliente(null, null);
    }
    
    public verificarInput(input: string, tipoControl: string) {
      this.disabled = this.validacionesGenerales.verificarInput(input, tipoControl);
 
    }
  
    public buscar() {
      if (this.numDoc && this.tipoDoc && this.pais) {
        this.consultas.buscarCliente(this.tipoDoc, this.numDoc, this.pais).subscribe(success => {
          this.showModalBaja = false;
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
    
    public confirmarBaja(){
      
      let observable: Observable<any>;
      if(this.numGestar) {   
       observable = this.consultas.deleteEnrolamientoHuella(this.currentCliente.id_persona, this.currentCliente.numero_documento, this.currentCliente.pais_documento, this.currentCliente.tipo_documento, this.numGestar, this.aplicacion, this.motivoBaja);
        observable.subscribe(success => {        
          this. cleanElementsBaja();
          this.errorService.setMessage(
            'success',
            'Baja Biométrica - Huella',
            'Se realizo la baja biométrica de la huella del cliente de forma exitosa'
          );        
        }, error => {
          this.errorService.setMessage(
            'warn',
            'Baja Biométrica - Huella',
            'No se pudo realizar la baja biométrica de la huella del cliente'
          ); 
        })
      } else {
        this.errorService.setError(new Error("Portal de clientes", "Portal de Clientes", "Por favor ingrese el número de gestar para dar la baja.", "0"));
      }
      
    }
    showModalBajaBiometrica() {
      this.numGestar=null;
      this.showModalBaja = true;
    }
  
    public cleanElementsBaja() {
      this.buscarAgain();
      this.numGestar=null;
      this.showModalBaja = false;
    }
  
  }
  