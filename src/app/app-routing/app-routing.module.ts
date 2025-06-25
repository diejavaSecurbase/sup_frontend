import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiometriaComponent } from '../biometria/biometria.component';
import { BiometriaCajasComponent } from '../biometria-cajas/biometria-cajas.component';
import { BioFacialComponent } from '../bio-facial/bio-facial.component';
import { CajaseguridadComponent } from '../cajaseguridad/cajaseguridad.component';
import { DetalleCajaComponent } from '../detalle-caja/detalle-caja.component';

const routes: Routes = [
  { path: '', redirectTo: 'biometria', pathMatch: 'full' },
  { path: 'biometria', component: BiometriaComponent },
  { path: 'biometria/cajas', component: BiometriaCajasComponent },
  { path: 'bio-facial', component: BioFacialComponent },
  { path: 'cajaseguridad', component: CajaseguridadComponent },
  { path: 'detalle-caja', component: DetalleCajaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
