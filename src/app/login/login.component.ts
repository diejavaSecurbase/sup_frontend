import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/HttpServices/login.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';
import { MessageService } from 'primeng/api';
import { XfsApiService } from '../services/huella/xfs-api.service';
import { HuellaService } from '../services/HttpServices/huella.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, OnDestroy {

  subscr: Subscription = new Subscription();
  public esEmbebido: boolean = window !== window.parent;
  public isLogged = true;
  status: string;
  version: string;
  usuario = '';
  password = '';
  displayPopUpSesionActiva = false;
  cerrarSesionClicked = false;
  usuarioFalloVerificar = null;
  passFalloVerificar = null;
  public imagenHuella1= ' ';

  private userVerificacion: string = null;
  private passVerificacion: string = null;

  constructor( private servicioLogin: LoginService,
               private activRoute: ActivatedRoute,
               private router: Router,
               private errorService: ErrorService,
               private messageService: MessageService,
               private route: ActivatedRoute,
               private xfsService: XfsApiService,
               private huellaService: HuellaService) {}

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  ngOnInit(): void {
    this.xfsService.cancelScanFingerprint().subscribe(success => {
    }, 
    error => {
      this.huellaService.cancelarEscaneo().subscribe()
    }
    );
    this.servicioLogin.getNavUser().subscribe(success => {
      if(success && success.grupo){
        this.isLogged = true
      }
      else{
        this.isLogged = false;
      }
    })

    if (window !== window.parent){
    }
    else if (window === window.parent){
    }
  }
  private saltarAPagina(perfil: string){
    switch(perfil){
      case 'BIOMETRIA':
        this.router.navigate(['biometria']);
        break;
      case 'ENROLADOR_RRHH':
        this.router.navigate(['biometria']);
        break;
      case 'CAJA_SEGURIDAD_RRHH':
        this.router.navigate(['bio-facial']);
        break;  
      case 'CAJA_SEGURIDAD':
        this.router.navigate(['cajas']);
        break;
      case 'CAJA_SEGURIDAD_RRHH':
        this.router.navigate(['cajas']);
        break;
      case 'REPORTE':
        this.router.navigate(['cajas/reportes/detalle']);
        break;
      case 'BAJA_HUELLA':
        this.router.navigate(['baja-biometrica-huella/baja']);
       
    }
  }

  loguarse() {
    if (this.usuario.length > 0 && this.password.length > 0){
          this.servicioLogin.loguearUsuario(this.usuario, this.password).subscribe(data => {
            this.servicioLogin.addAuditoriaAcceso(data).subscribe( auditoria => {
            });
            const perfil = data.perfil;
            this.servicioLogin.getEncryptionKey().subscribe ( key => {});  
            this.saltarAPagina(perfil);
          },
          err => {
            if(err.status == 403){
              this.passFalloVerificar = this.password;
              this.usuarioFalloVerificar = this.usuario;
              this.displayPopUpSesionActiva = true;
            }
            this.password = '';
          });
    }
    else{
      this.errorService.setError(new Error('Portal de clientes', 'Portal de Clientes', 'Por favor ingrese su usuario y contraseña', '0'));
    }

  }

  refrescar() {
    this.router.navigate(['/'], {relativeTo: this.route});
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }


  borrarSesion(){
    this.servicioLogin.eliminarSesion(false, this.usuarioFalloVerificar).subscribe(success => {
      this.displayPopUpSesionActiva = false;
      this.errorService.setMessage('info', 'Portal de Clientes', 'sesión terminada con éxito');
    },
    failure => {
      this.displayPopUpSesionActiva = false;
      this.errorService.procesarRespuestaError(failure);
    })
  }

  cerrarVentanaSesion(){
    this.displayPopUpSesionActiva = false;
    this.usuarioFalloVerificar = null;
    this.passFalloVerificar = null;
  }
}
