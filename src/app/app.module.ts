import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationInterceptor } from './Interceptors/AutenticatorInterceptor';
import { EnvServiceProvider } from './env.service.provider';
import { NavComponent } from './nav/nav.component';
import { ErrorComponent } from './error/error.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { BiometriaComponent } from './biometria/biometria.component';
import { EnrolamientoComponent } from './enrolamiento/enrolamiento.component';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule} from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule} from 'primeng/button';
import { InputTextModule} from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuHorizontalComponent } from './menu-horizontal/menu-horizontal.component';
import {TabMenuModule} from 'primeng/tabmenu';
import {ToastModule} from 'primeng/toast';
import {RatingModule} from 'primeng/rating';
import {InputSwitchModule} from 'primeng/inputswitch';
import {SelectButtonModule} from 'primeng/selectbutton';
import {BlockUIModule} from 'primeng/blockui';
import { CurarUrlPipe } from './pipes/curar-url.pipe';
import { IdentificacionComponent } from './identificacion/identificacion.component';
import { CajaseguridadComponent } from './cajaseguridad/cajaseguridad.component';
import { DetalleCajaComponent } from './detalle-caja/detalle-caja.component';
import { EstadoRecintoComponent } from './estado-recinto/estado-recinto.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { CamelCaseToEspacioPipe } from './pipes/camel-case-to-espacio.pipe';
import { BiometriaCajasComponent } from './biometria-cajas/biometria-cajas.component';
import { ReporteIngresosComponent } from './reporte-ingresos/reporte-ingresos.component';
import { ReporteDetalleComponent } from './reporte-detalle/reporte-detalle.component';
import {StepsModule} from 'primeng/steps';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './Interceptors/loader.interceptor';
import { FormTelefonoComponent } from './dynamicDialog/form-telefono/form-telefono.component';
import {DynamicDialogModule, DialogService} from 'primeng/dynamicdialog';
import { FormMailComponent } from './dynamicDialog/form-mail/form-mail.component';
import { FingerPreviewComponent } from './finger-preview/finger-preview.component';
import { BioFacialComponent } from './bio-facial/bio-facial.component';
import { AuditoriaRegistroUsuarioBiometricoComponent } from './auditoria-registro-usuario-biometrico/auditoria-registro-usuario-biometrico.component';
import { BajaHuellaBiometricaComponent} from './baja-biometrica-huella/baja-biometrica-huella.component';
import { InformacionClienteComponent } from './informacion-cliente/informacion-cliente.component';
import { ReporteBajasComponent } from './reporte-bajas/reporte-bajas.component';

export const INTERCEPTORS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    NavComponent,
    ErrorComponent,
    MenuComponent,
    BiometriaComponent,
    EnrolamientoComponent,
    MenuHorizontalComponent,
    CurarUrlPipe,
    IdentificacionComponent,
    CajaseguridadComponent,
    DetalleCajaComponent,
    EstadoRecintoComponent,
    CamelCaseToEspacioPipe,
    BiometriaCajasComponent,
    ReporteIngresosComponent,
    ReporteDetalleComponent,
    SpinnerComponent,
    FormTelefonoComponent,
    FormMailComponent,
    FingerPreviewComponent,
    BioFacialComponent,
    AuditoriaRegistroUsuarioBiometricoComponent,
    BajaHuellaBiometricaComponent,
    InformacionClienteComponent,
    ReporteBajasComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    TableModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    CalendarModule,
    AutoCompleteModule,
    InputTextareaModule,
    FontAwesomeModule,
    InputNumberModule,
    BrowserAnimationsModule,
    TabMenuModule,
    ToastModule,
    RatingModule,
    InputSwitchModule,
    SelectButtonModule,
    BlockUIModule,
    ProgressSpinnerModule,
    StepsModule,
    DynamicDialogModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DatePipe,
    INTERCEPTORS,
    EnvServiceProvider
  ],
  entryComponents: [
    FormTelefonoComponent
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
