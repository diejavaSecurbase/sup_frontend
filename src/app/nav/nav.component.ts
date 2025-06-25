import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/HttpServices/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private servicioLogin: LoginService, private router: Router) { }
  public esEmbebido: boolean = window !== window.parent;
  public nombre = null;
  public grupo = null;

  ngOnInit(): void {
    this.servicioLogin.getNavUser().subscribe(success => {
      this.nombre = success.nombre;
      this.grupo = success.grupo;
    });
  }

  logout() {
    if (this.servicioLogin.logout(true) === true) {
      this.router.navigate(['']);
    }
  }
}
