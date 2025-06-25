import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/HttpServices/login.service';
import { Menu } from 'src/app/DTO/Menu';
import { THIS_EXPR, NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Cliente } from '../DTO/cliente';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menu: string[] = null;
  menuStatus = {
    closed: true,
    closing: false,
    opened: false,
    opening: false
  };
  public esEmbebido: boolean = window !== window.parent;
  public currentCliente: Cliente = null;
  public currentId: IdentificacionCliente = null;
  constructor( private loginService: LoginService, private consultasService: ConsultasService) { }

  ngOnInit(): void {
    this.consultasService.getCurrentClienteObservable().subscribe(success => {
      this.currentCliente = success;
    });
    this.consultasService.getCurrentIdObservable().subscribe(success => {
      this.currentId = success;
    });
    this.loginService.getFuncionesObservable().subscribe(success => {
      if (success == null){
        this.menu = null;
        this.menuStatus.closed = true;
        this.menuStatus.closing = false;
        this.menuStatus.opening = false;
        this.menuStatus.opened = false;
      }
      else{
        this.menu = new Array();
        success.forEach(funcion => {
          this.menu.push(funcion);
        });
      }
    });
  }

  toggleMenu(){
    if (this.menuStatus.closed){
      this.menuStatus.closed = false;
      this.menuStatus.closing = false;
      this.menuStatus.opening = true;
      this.menuStatus.opened = true;
    }
    else{
      this.menuStatus.opened = false;
      this.menuStatus.opening = false;
      this.menuStatus.closed = true;
      this.menuStatus.closing = true;
    }
  }
}

