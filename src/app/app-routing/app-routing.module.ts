import { BiometriaCajasComponent } from './../biometria-cajas/biometria-cajas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FuncionGuard } from '../guards/funcion.guard'
import { BiometriaComponent } from '../biometria/biometria.component';
import { EnrolamientoComponent } from '../enrolamiento/enrolamiento.component';
import { IdentificacionComponent } from '../identificacion/identificacion.component';
import { CajaseguridadComponent } from '../cajaseguridad/cajaseguridad.component';
import { DetalleCajaComponent } from '../detalle-caja/detalle-caja.component';
import { EstadoRecintoComponent } from '../estado-recinto/estado-recinto.component';
import { ReporteDetalleComponent } from '../reporte-detalle/reporte-detalle.component';
import { ReporteIngresosComponent } from '../reporte-ingresos/reporte-ingresos.component';
import { ServicioBiometricoGuard } from '../guards/servicio-biometrico.guard';
import { EmpleadoGuard } from '../guards/empleado.guard';
import { FormTelefonoComponent } from '../dynamicDialog/form-telefono/form-telefono.component';
import { FormMailComponent } from '../dynamicDialog/form-mail/form-mail.component';
import { BioFacialComponent } from '../bio-facial/bio-facial.component';
import { AuditoriaRegistroUsuarioBiometricoComponent } from '../auditoria-registro-usuario-biometrico/auditoria-registro-usuario-biometrico.component';
import { BajaHuellaBiometricaComponent } from '../baja-biometrica-huella/baja-biometrica-huella.component';
import { ReporteBajasComponent } from '../reporte-bajas/reporte-bajas.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'biometria',
      component: BiometriaComponent,
      canActivate: [FuncionGuard],
      data: {
        rolesEsperados: ['BIOMETRIA', 'CAJA_SEGURIDAD']
      }
    },
    { path: 'biometria/alta',
      component: EnrolamientoComponent,
      canActivate: [FuncionGuard, EmpleadoGuard, ServicioBiometricoGuard],
      data: {
        rolesEsperados: ['BIOMETRIA','CAJA_SEGURIDAD']
      }
    },
    { path: 'biometria/modificacion',
      component: EnrolamientoComponent,
      canActivate: [FuncionGuard, EmpleadoGuard, ServicioBiometricoGuard],
      //canActivate: [FuncionGuard, EmpleadoGuard],
      data: {
        rolesEsperados: ['BIOMETRIA','CAJA_SEGURIDAD']
      }
    },
    { path: 'cajas',
      component: IdentificacionComponent,
      canActivate: [FuncionGuard],
      data: {
        rolesEsperados: ['CAJA_SEGURIDAD']
      }
    },
    {
      path: 'cajas/estadoRecinto',
      component: EstadoRecintoComponent,
      canActivate: [FuncionGuard],
      data: {
        rolesEsperados: ['CAJA_SEGURIDAD']
      }
    },
    { path: 'cajas/biometria',
      component: BiometriaCajasComponent,
      canActivate: [FuncionGuard, EmpleadoGuard, ServicioBiometricoGuard],
      //canActivate: [FuncionGuard, EmpleadoGuard],
      data: {
        rolesEsperados: ['CAJA_SEGURIDAD']
      }
    },
    { path: 'cajas/reportes/detalle',
      component: ReporteDetalleComponent,
      canActivate: [FuncionGuard],
      data: {
        rolesEsperados: ['CAJA_SEGURIDAD', 'REPORTE']
      }
    },
    { path: 'cajas/reportes/ingresos',
      component: ReporteIngresosComponent,
      canActivate: [FuncionGuard],
      data: {
      rolesEsperados: ['CAJA_SEGURIDAD', 'REPORTE']
      }
    },
    { path: 'bio-facial',
      component: BioFacialComponent,
      canActivate: [FuncionGuard],
      data: {
        rolesEsperados: ['BIOMETRIA', 'CAJA_SEGURIDAD']
      }
    },
    { path: 'baja-biometrica-huella/baja',
    component: BajaHuellaBiometricaComponent,
    canActivate: [FuncionGuard],
    data: {
      rolesEsperados: ['BAJA_HUELLA','CAJA_SEGURIDAD']
    }},
    { path: 'auditoria-registro',
    component: AuditoriaRegistroUsuarioBiometricoComponent,
    canActivate: [FuncionGuard],
    data: {
      rolesEsperados: ['BIOMETRIA', 'CAJA_SEGURIDAD','BAJA_HUELLA']
    }},
    { path: 'baja-biometrica-huella/reportes',
    component: ReporteBajasComponent,
    canActivate: [FuncionGuard],
    data: {
      rolesEsperados: ['BAJA_HUELLA','CAJA_SEGURIDAD']
    }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
