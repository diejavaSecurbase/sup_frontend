import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

// Services
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthenticationInterceptor } from './app/Interceptors/AutenticatorInterceptor';
import { LoaderInterceptor } from './app/Interceptors/loader.interceptor';
import { LoaderService } from './app/services/loader.service';
import { EnvServiceProvider } from './app/env.service.provider';

// FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Routes
import { routes } from './app/app-routing/app-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      RouterModule.forRoot(routes),
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
    ),
    ConfirmationService,
    MessageService,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    EnvServiceProvider,
    LoaderService,
    DialogService
  ]
}).catch(err => console.error(err));