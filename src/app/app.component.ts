import { Component, ViewEncapsulation } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { LoginService } from './services/HttpServices/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'spa-portal-clientes';

  constructor(public env: EnvService,
              private ServicioLogin: LoginService) {


  }

}
