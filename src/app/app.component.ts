import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { EnvService } from 'src/app/env.service';
import { LoginService } from './services/HttpServices/login.service';
import { SpinnerComponent } from './spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MessagesModule,
    SpinnerComponent
  ],
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