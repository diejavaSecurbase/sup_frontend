import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { LoginService } from '../services/HttpServices/login.service';
import { Menu } from '../DTO/Menu';
import { Cliente } from '../DTO/cliente';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.css']

})
export class MenuHorizontalComponent implements OnInit {

  constructor( private loginService: LoginService, private consultasService: ConsultasService,  private router: Router) { }

  public items: MenuItem[];
  public esEmbebido: boolean = window !== window.parent;
  menu: string[] = null;

  public currentId: IdentificacionCliente = null;
  public currentDetalle: Cliente = null;

  ngOnInit() {
      this.consultasService.getCurrentIdObservable().subscribe(success => {
        let detalle = this.consultasService.getCurrentClienteValue();
        this.currentDetalle = detalle;
        this.currentId = success;
        this.updateMenu();
      });
      this.loginService.getFuncionesObservable().subscribe(success => {
        if (success == null){
          this.menu = null;
        }
        else{
          this.menu = new Array();
          success.forEach(funcion => {
            this.menu.push(funcion);
          });
        }
        this.updateMenu();
      });
  }

  public updateMenu(){
    this.items = [
      {
        label: 'Inicio Biometría',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/biometria'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('BIOMETRIA')
      },
      {
        label: 'Alta Biométrica',
        routerLink: this.currentDetalle != null && this.currentId != null && !this.currentId.perfil_biometrico && (!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH"))) ? ['/biometria/alta'] : null,
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('BIOMETRIA'),
        disabled: !this.currentDetalle || !(this.currentId != null && !this.currentId.perfil_biometrico ) ||!(!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH")))
      },
      {
        label: 'Modificacion Biométrica',
        routerLink: this.currentDetalle != null && this.currentId != null && this.currentId.perfil_biometrico && (!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH"))) ? ['/biometria/modificacion'] : null,
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('BIOMETRIA'),
        disabled: !this.currentDetalle || !(this.currentId != null && this.currentId.perfil_biometrico ) ||!(!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH")))
      },
      {
        label: 'Biometria',
        routerLink: this.currentDetalle && (!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH"))) ? ['/cajas/biometria'] : ['/biometria'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('CAJA_SEGURIDAD'),
        // disabled: !this.currentDetalle || !(!this.currentDetalle.es_empleado || this.currentDetalle.es_empleado && (this.loginService.obtenerFunciones().includes("ENROLADOR_RRHH") || this.loginService.obtenerFunciones().includes("CAJA_SEGURIDAD_RRHH")))
      },
      {
        label: 'Cajas Seguridad',
        routerLink: ['/cajas'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('CAJA_SEGURIDAD')
      },
      {
        label: 'Estado Recinto',
        routerLink: ['/cajas/estadoRecinto'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('CAJA_SEGURIDAD')
      },
      {
        label: 'Reporte Ingresos',
        routerLink: ['/cajas/reportes/ingresos'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('REPORTE')
      },
      {
        label: 'Reporte Detalle',
        routerLink: ['/cajas/reportes/detalle'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('REPORTE'),
      },
      {
        label: 'Consulta Biometría Facial',
        icon: 'pi pi-face',
        routerLink: ['/bio-facial'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('CAJA_SEGURIDAD_RRHH')
      }
      ,
      {
        label: 'Baja Huella Biométrica',
        routerLink: ['/baja-biometrica-huella/baja'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('BAJA_HUELLA')
      },
      
      {
        label: 'Reportes Bajas',
        routerLink: ['/baja-biometrica-huella/reportes'],
        routerLinkActiveOptions: {exact: true},
        visible: this.containsFunction('BAJA_HUELLA')
      } 
    ];
  }

  private containsFunction(funcion: string): boolean{
    return this.menu != null && this.menu.includes(funcion);
  }

  isCajaSeguridad(){
    return sessionStorage.getItem("rol") === "CAJA_SEGURIDAD_RRHH";
  }
  redirectNuevasFuncionalidades(){
    this.router.navigate(['/auditoria-registro']);
  }
}
