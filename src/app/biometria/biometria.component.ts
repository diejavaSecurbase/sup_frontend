import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { Cliente } from '../DTO/cliente';
import { TipoDocumento } from '../DTO/tipo-documento';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { SelectItem } from 'primeng/api';
import { GeneralLoadsService } from '../services/general-loads.service';

@Component({
  selector: 'app-biometria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DropdownModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './biometria.component.html',
  styleUrls: ['./biometria.component.css']
})
export class BiometriaComponent implements OnInit {

  numDoc: number;
  tipoDoc: string;
  pais: string;
  //Boolean para deshabilitar el boton del form
  public disabled: boolean = false;

  public tiposDocs: SelectItem[] = null;
  public paisesOrigen: SelectItem[];
  public currentCliente: Cliente = null;
  public currentId: IdentificacionCliente = null;

  constructor(
    private consultas: ConsultasService,
    private errorService: ErrorService,
    private validacionesGenerales: GeneralLoadsService
  ) { }

  ngOnInit(): void {
    this.currentCliente = null;
    this.currentId = null;
    this.numDoc = null;
    this.consultas.setCurrentCliente(null, null);
    
    this.consultas.getCurrentClienteObservable().subscribe(success => {
      this.currentCliente = success;
    }, error => {

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

  public buscar() {
    if (this.numDoc && this.tipoDoc && this.pais) {
      this.consultas.buscarCliente(this.tipoDoc, this.numDoc, this.pais).subscribe(success => {
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

  public verificarInput(input: string) {
    let tipoControl = 'documento';
    this.disabled = this.validacionesGenerales.verificarInput(input, tipoControl);
  }
}