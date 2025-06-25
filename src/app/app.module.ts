import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';

// COMPONENTES Y DEPENDENCIAS A CONSERVAR
import { BiometriaComponent } from './biometria/biometria.component';
import { BiometriaCajasComponent } from './biometria-cajas/biometria-cajas.component';
import { BioFacialComponent } from './bio-facial/bio-facial.component';
import { CajaseguridadComponent } from './cajaseguridad/cajaseguridad.component';
import { DetalleCajaComponent } from './detalle-caja/detalle-caja.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FingerPreviewComponent } from './finger-preview/finger-preview.component';
import { CurarUrlPipe } from './pipes/curar-url.pipe';
import { CamelCaseToEspacioPipe } from './pipes/camel-case-to-espacio.pipe';

// INTERCEPTORES Y SERVICIOS NECESARIOS
import { AuthenticationInterceptor } from './Interceptors/AutenticatorInterceptor';
import { LoaderInterceptor } from './Interceptors/loader.interceptor';
import { LoaderService } from './services/loader.service';
import { EnvServiceProvider } from './env.service.provider';

export const INTERCEPTORS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent,
    BiometriaComponent,
    BiometriaCajasComponent,
    BioFacialComponent,
    CajaseguridadComponent,
    DetalleCajaComponent,
    SpinnerComponent,
    FingerPreviewComponent,
    CurarUrlPipe,
    CamelCaseToEspacioPipe
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
    ToastModule,
    BlockUIModule,
    ProgressSpinnerModule,
    DynamicDialogModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DatePipe,
    INTERCEPTORS,
    EnvServiceProvider,
    LoaderService,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
