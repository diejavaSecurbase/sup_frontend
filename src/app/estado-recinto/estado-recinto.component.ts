import { Subscription } from 'rxjs';
import { LoginService } from './../services/HttpServices/login.service';
import { PersonaRecinto } from './../DTO/PersonaRecinto';
import { AuditoriaRecinto } from './../DTO/AuditoriaRecinto';
import { EstadoCajaRecinto } from './../DTO/estado-caja-recinto';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { environment } from '../../environments/environment';

import { ConfirmationService } from 'primeng/api';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-estado-recinto',
  templateUrl: './estado-recinto.component.html'
})
export class EstadoRecintoComponent implements OnInit, OnDestroy {

  estadosRecinto: EstadoCajaRecinto[] = [];
  momentoAbierto;
  tiempoViendoPantalla = 0;
  tiempoAlerta: number;
  tiempoMaxRecinto: number;
  mostrarBotonActualizar = false;
  auditorias: AuditoriaRecinto[] = [];
  personasEnRecinto: PersonaRecinto[] = [];
  sucursal = '';
  isLoading = true;
  isFirstMessage = true;
  private subscripciones: Subscription[] = [];
  @Output() botonVolver: EventEmitter<any> = new EventEmitter<any>();

  constructor( private cajasService: CajaseguridadService,
               private loginService: LoginService,
               private confirmationService: ConfirmationService,
               private errorService: ErrorService) {

   }

  ngOnInit(): void {
    this.estadosRecinto = [];
    this.subscripciones.push(
      this.cajasService.getPersonasRecintoObservable().subscribe(personas => {
        if(this.isFirstMessage){
          this.isFirstMessage = false;
        }
        else{
          this.estadosRecinto = [];
          this.personasEnRecinto = personas;
          personas.forEach(persona => {
            this.cargarDatosGrilla(persona);
          });
        }
      })
    )
    this.subscripciones.push(this.loginService.getSucursal().subscribe(sucursal => {
      this.sucursal = sucursal;
      this.obtenerPersonasRecinto();
      this.momentoAbierto = new Date().getTime();
      setInterval(() => {
        this.tiempoViendoPantalla += 1000;
      }, 1000);
    }));

  }

  ngOnDestroy(){
    this.subscripciones.forEach(subscripccion => {
      subscripccion.unsubscribe();
    })
  }

  obtenerPersonasRecinto() {
    this.cajasService.obtenerPersonasRecinto(this.sucursal).subscribe(personas => {
      this.personasEnRecinto = personas;
      personas.forEach(persona => {
        this.cargarDatosGrilla(persona);
      });
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    });
  }

  abrirConfirmacion(caja: EstadoCajaRecinto) {
    this.confirmationService.confirm({
      message: '¿Desea registrar el Egreso del recinto del cliente ' + caja.apellidoNombre + ' ?',
      header: 'Egreso recinto',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.salir(caja);
      },
      reject: () => {
      }
    });
  }

  salir(caja: EstadoCajaRecinto) {    
    const cliente = this.personasEnRecinto.find( persona => persona.nombreApellido === caja.apellidoNombre);
      this.cajasService.eliminarClienteRecinto(cliente.documento.numero).subscribe(result => {
        if(result === 'OK'){
          this.auditorias = this.generarAuditoriasEgreso(cliente);
          this.cajasService.auditarRecinto(this.auditorias).subscribe(data => {
          });
        }
        else{
          this.errorService.setMessage("info", "Portal de Clientes", "La persona seleccionada ya se encontraba fuera del recinto")
        }
        this.actualizar();
      });
    
  }

  cargarDatosGrilla(persona: PersonaRecinto) {

    const rowCaja = new EstadoCajaRecinto();
    rowCaja.cliente = persona.documento.pais + ' ' + persona.documento.tipo + ' ' + persona.documento.numero;
    rowCaja.apellidoNombre = persona.nombreApellido;
    rowCaja.identificacion = persona.tipoIdentificacion;
    rowCaja.horaIngreso = new Date(persona.fecha).getTime();
    rowCaja.cajas = persona.nroCaja;
    this.estadosRecinto.push(this.cloneRow(rowCaja));
  }

  actualizar() {
    this.estadosRecinto = [];
    this.obtenerPersonasRecinto();
  }

  cloneRow(r: EstadoCajaRecinto): EstadoCajaRecinto {
    const row = new EstadoCajaRecinto();
    return row.clone(r);
  }

  cloneAuditoria(audit: AuditoriaRecinto): AuditoriaRecinto {
    const row = new AuditoriaRecinto();
    return row.clone(audit);
  }

  generarAuditoriasEgreso(cliente: PersonaRecinto): AuditoriaRecinto[] {
    const nrosCajas = cliente.nroCaja.split(',');
    const nrosCuentas = cliente.cuenta.split(',');
    const tiposAccesos = cliente.tipoAcceso.split(',');
    const auditorias = [];
    nrosCajas.forEach((e, i) => {
      const auditoria = new AuditoriaRecinto();
      auditoria.doc = cliente.documento;
      auditoria.nombreApellido = cliente.nombreApellido;
      auditoria.sucursal = cliente.sucursal;
      auditoria.tipoIdent = cliente.tipoIdentificacion;
      auditoria.nroCaja = e;
      auditoria.cuenta = nrosCuentas[i];
      auditoria.tipoAcceso = tiposAccesos[i];
      auditoria.accion = 'E';
      auditoria.tiempo = (this.momentoAbierto - new Date(cliente.fecha).getTime() + this.tiempoViendoPantalla) / 1000;
      auditorias.push(this.cloneAuditoria(auditoria));
    });
    return auditorias;
  }

}
