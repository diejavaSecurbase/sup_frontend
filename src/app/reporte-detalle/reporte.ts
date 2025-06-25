import { Directive, Injectable, OnInit } from '@angular/core';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { CajaseguridadService } from '../services/HttpServices/cajaseguridad.service';
import { ErrorService } from '../services/error.service';
import { SelectItem } from 'primeng/api';
import { ReporteDetalle } from '../DTO/reporte-detalle';
import { DatePipe } from '@angular/common';

@Directive()
export abstract class Reporte implements OnInit{
    public paisesOrigen: SelectItem[];
    public tiposDocs: SelectItem[] = null;
    public isLoading = false;
    es: any;
    public pais: string;
    public tipoDoc: string;
    public sucursal: string;
    cabeceras: any[];

    constructor( protected datePipe: DatePipe, public consultas: ConsultasService, public loginService: LoginService, public cajaSeguridadService: CajaseguridadService, public errorService: ErrorService) { }

    ngOnInit(): void {
        
        this.cabeceras = this.setCabeceras();
        this.loginService.getSucursal().subscribe(success =>{
          this.sucursal = success;
        })
        this.consultas.getTiposDocs().subscribe(success=>{
          success.sort((a,b)=>{
            return a.orden - b.orden;
          })
          let nuevoTipos: SelectItem[] = new Array();
          success.forEach(tipo=>{
            //if(tipo.id != "CUIT"){
              nuevoTipos.push({ label: tipo.id,
                                value: tipo.codigoSoa});
            //}
          })
          this.tiposDocs = nuevoTipos;
          this.tipoDoc = this.tiposDocs[0].value;
        }, error=>{
          this.tiposDocs = [{label: "DNI", value: "4"}];
          this.tipoDoc = this.tiposDocs[0].value;
        });
        this.es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
            today: 'Hoy',
            clear: 'Borrar'
          };
        this.consultas.getPaises().subscribe(success=>{
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

    protected abstract setCabeceras(): any;
}