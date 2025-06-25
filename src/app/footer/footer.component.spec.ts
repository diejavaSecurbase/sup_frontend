import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Version } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { EnvService } from '../env.service';
import { ErrorService } from '../services/error.service';
import { LoginService } from '../services/HttpServices/login.service';
import { VersionService } from '../services/HttpServices/version.service';
import { FooterComponent } from './footer.component';
import { XfsApiService } from '../services/huella/xfs-api.service';

class FakeActivatedRoute{

}

class FakeRouter{
  navigate(){
    console.log('LLEGASTE HASTA EL FINAL');
  }
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [FooterComponent],
      providers: [VersionService, HttpClient, LoginService, EnvService, ErrorService, MessageService,
      {provide: ActivatedRoute, useClass: FakeActivatedRoute},
      {provide: Router, useClass: FakeRouter} ],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = new FooterComponent(null, null);
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse una instancia', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() error', () => {
    let versionServiceTest = TestBed.inject(VersionService);
    let driverVersionServiceTest = TestBed.inject(XfsApiService);
    let spygetVersion = spyOn(versionServiceTest, 'getVersion').and.returnValue(throwError(new Error()));
    let spygetDriverVersion = spyOn(driverVersionServiceTest, 'checkScanFingerPrintVersion').and.returnValue(throwError(new Error()));

    component.ngOnInit();
    
    expect(component.version).toBe('not found');
    expect(component.versionDriver).toBe('');
    expect(spygetVersion).toHaveBeenCalled();
    expect(spygetDriverVersion).toHaveBeenCalled();
  })
});
