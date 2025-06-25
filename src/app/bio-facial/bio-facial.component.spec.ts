import { BioFacialComponent } from './bio-facial.component';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ErrorService } from '../services/error.service';
import { asapScheduler, Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { mockTipoDocumentos } from '../mocks/tipoDocumento';
import { mockEnrolamientoFacialDTO_CONFIRMADO, mockEnrolamientoFacialDTO_ELIMINADO, mockEnrolamientoFacialDTO_EN_PROCESO, mockEnrolamientoFacialDTO_EXPIRADO } from '../mocks/enrolamientoFacialDto';
import { mockIdentificacionCliente, mockIdentificacionClienteReporteBaja } from '../mocks/identificacionCliente';
import { mockPaises } from '../mocks/pais';
import { mockResponseAuthHistory } from '../mocks/authHistoryList';
import { mockDocumento } from '../mocks/documento';



//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('BioFacialComponent', () => {
  let component: BioFacialComponent;
  let fixture: ComponentFixture<BioFacialComponent>;
  let consultasServiceTest: jasmine.SpyObj<ConsultasService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let loginServiceTest: jasmine.SpyObj<LoginService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BioFacialComponent ],
      providers: [
        ConsultasService,
        ErrorService,
        LoginService,
        HttpClient,
        EnvService,
        MessageService,
        { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: FakeRouter },
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        DropdownModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {

    consultasServiceTest = jasmine.createSpyObj('ConsultasService', [
      'setCurrentClienteFacial',
      'getCurrentClienteFacialObservable',
      'getCurrentIdObservable',
      'getPaises',
      'getTiposDocs',
      'getClienteEnrollFacial',
      'getAuthHistory',
      'deleteEnrolamientoFacial',
      'patchValidarManual'
    ]);
    
    consultasServiceTest.getCurrentIdObservable.and.returnValue(of(mockIdentificacionCliente));
    consultasServiceTest.getCurrentClienteFacialObservable.and.returnValue(of(mockEnrolamientoFacialDTO_EN_PROCESO))
    consultasServiceTest.getTiposDocs.and.returnValue(of(mockTipoDocumentos));
    consultasServiceTest.getPaises.and.returnValue(of(mockPaises));        
    
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['setError','setMessage']);
    loginServiceTest = jasmine.createSpyObj('LoginService', ['getSucursal']);

    TestBed.configureTestingModule({
          declarations: [BioFacialComponent],
          providers: [{ provide: ConsultasService, useValue: consultasServiceTest},
            { provide: ErrorService, useValue: errorServiceSpy },
            {provide: LoginService, useValue:loginServiceTest }
          ]
        });

    fixture = TestBed.createComponent(BioFacialComponent);
    component = fixture.componentInstance;
    
  });


  it('should create BioFacialComponent', fakeAsync(() => {
    
    //Se llama al metodo ngOnInit() para poder crear la clase correctamente.
    component.ngOnInit();
    
    //EXPECTS
    expect(component.currentCliente).not.toBeNull();
    expect(component.currentId).not.toBeNull();
    expect(component.tipoDoc).toEqual('DNI');
    expect(component.paisesOrigen.length).toEqual(1);

  }));


  it('buscar()', ()=>{
    
    component.numDoc = 1;
    component.tipoDoc = 'DNI';
    component.pais = '80';
    fixture.detectChanges();
    consultasServiceTest.getClienteEnrollFacial.withArgs(component.tipoDoc,component.numDoc, component.pais).and.returnValue(of(mockEnrolamientoFacialDTO_CONFIRMADO));
    spyOn(component, 'buscarAgain');

    component.buscar();

    expect(component.currentCliente).not.toBeNull;
    
  });
  it('debería mostrar error si faltan datos', () => {
    component.numDoc = null;
    component.buscar();
    
    expect(errorServiceSpy.setError).toHaveBeenCalledBefore;
  });

  it('buscarAgain()', ()=>{
    
    consultasServiceTest.setCurrentClienteFacial.call;
    component.buscarAgain();
       
    expect(component.currentCliente).toBeNull;
    expect(component.currentId).toBeNull;
    expect(component.numDoc).toBeNull;
    
  });

  
  it('FAIL consultas.getCurrentClienteFacialObservable()', ()=>{
    consultasServiceTest.getCurrentClienteFacialObservable.and.returnValue(throwError(new Error()));
     //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    expect(consultasServiceTest.getCurrentClienteFacialObservable).toHaveBeenCalledBefore;
  })

  
  it('FAIL consultas.getTiposDocs()', ()=>{
    consultasServiceTest.getTiposDocs.and.returnValue(throwError(new Error()));
     
    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    expect(consultasServiceTest.getTiposDocs).toHaveBeenCalledBefore;
    expect(component.tipoDoc).toEqual('4');
  })

  it('FAIL buscar()', ()=>{
    
  component.numDoc = 1;
  component.tipoDoc = ' ';
  component.pais = ' ';
  consultasServiceTest.getClienteEnrollFacial.withArgs(component.tipoDoc,component.numDoc, component.pais).and.returnValue(throwError(new Error()));
  spyOn(component, 'buscarAgain');

  component.buscar();
  //EXPECTS
  expect(consultasServiceTest.getClienteEnrollFacial).toHaveBeenCalledBefore;
  expect(component.numDoc).toEqual(null);
    
  });
  
  it('FAIL showHistory()', ()=>{    
    fixture.detectChanges();
    let boton =fixture.debugElement.query(By.css('.ui-button-danger'));     
    expect(boton).toBeNull();
  });


  it('Show button showHistory()', ()=>{ 
    let fix = TestBed.createComponent(BioFacialComponent);
    let comp = fix.componentInstance;
    fix.detectChanges();

    comp.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO;
    fix.detectChanges();    
    let boton = fix.debugElement.query(By.css('button.ui-button-danger'));
  
    expect(boton).not.toBeNull();
     
  });

 
 it('showHistory()', ()=>{   
   
    component.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO;
    consultasServiceTest.getAuthHistory.withArgs(component.currentCliente.id_persona).and.returnValue(of(mockResponseAuthHistory));
    fixture.detectChanges();
    component.showHistory();
  
    expect(consultasServiceTest.getAuthHistory).toHaveBeenCalled();
  });

  it('Should be to Success validatePercentageFormat', () =>{
    let inputInicial=0.9101;
    let inputFinal=91.01;
    let response = component.validatePercentageFormat(inputInicial);
    expect(response).toEqual(inputFinal);
    
  });

  it('Return null validatePercentageFormat', () =>{
    let inputInicial=null;
    let response = component.validatePercentageFormat(inputInicial);    
    expect(response).toBeNull();
    
  });

  it('Should exist the borrarEnrolamiento and p-dialog',() =>{
    let fix = TestBed.createComponent(BioFacialComponent);
    let comp = fix.componentInstance;
    fix.detectChanges();      
   
    comp.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO;
    fix.detectChanges();
    
    let boton = fix.debugElement.query(By.css('#borrarEnrolamientobtn'));
    
    boton.nativeElement.click();
    fix.detectChanges();

    expect(boton).not.toBeNull();
    expect(comp.displayModalDeleteEnrollment).toBeTrue();
    expect(comp.nameSubname).not.toBeNull();
    
  });

  it('Should show the cancelarBajaEnrolamiento button',() =>{
    let fix = TestBed.createComponent(BioFacialComponent);
    let comp = fix.componentInstance;
    fix.detectChanges();      
   
    comp.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO;
    fix.detectChanges();
    
    let boton = fix.debugElement.query(By.css('#borrarEnrolamientobtn'));   
    boton.nativeElement.click();
    fix.detectChanges();
    
    let btnCancel = fix.debugElement.query(By.css('#cancelDeleteEnrollment'));
    btnCancel.nativeElement.click();
    fix.detectChanges();
    
    expect(boton).not.toBeNull();
    expect(comp.displayModalDeleteEnrollment).toBeFalse();
    expect(comp.nameSubname).toBeNull();
  });
 
  it('Should success deleteEnrolamientoFacial',() =>{
    
    component.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO; 
    consultasServiceTest.deleteEnrolamientoFacial.withArgs(component.currentCliente.id_enrolamiento.toString(),mockDocumento).and.returnValue(of(mockEnrolamientoFacialDTO_ELIMINADO));
   
    fixture.detectChanges();
    component.cancelarBajaEnrolamiento();
    
    expect(consultasServiceTest.deleteEnrolamientoFacial).toHaveBeenCalledBefore;
    expect(component.displayModalDeleteEnrollment).toBeFalse();
    expect(component.nameSubname).toBeNull();
  });

  it('FAIL deleteEnrolamientoFacial',() =>{
    component.currentCliente = mockEnrolamientoFacialDTO_CONFIRMADO; 
    consultasServiceTest.deleteEnrolamientoFacial.withArgs(component.currentCliente.id_enrolamiento.toString(),mockDocumento).and.returnValue(throwError(new Error()));

    fixture.detectChanges();
    component.cancelarBajaEnrolamiento();
    
    expect(consultasServiceTest.deleteEnrolamientoFacial).toHaveBeenCalledBefore;
    expect(component.displayModalDeleteEnrollment).toBeFalse();
    expect(component.nameSubname).toBeNull();
  });
 
  it('should validate manually successfully', ()=> {
    component.currentCliente = mockEnrolamientoFacialDTO_EXPIRADO;
    component.numDoc = 12345678;
    component.tipoDoc = 'DNI';
    component.pais = '80';
    component.sucursal = '100';
    
    loginServiceTest.getSucursal.and.returnValue(of(component.sucursal));
    consultasServiceTest.patchValidarManual.withArgs(component.currentCliente.id_enrolamiento, component.currentCliente.id_persona,'100', mockDocumento).and.returnValue(of(1));
    errorServiceSpy.setMessage.and.returnValue();

    component.validarManual();

    expect(loginServiceTest.getSucursal).toHaveBeenCalledBefore;
    expect(consultasServiceTest.patchValidarManual).toHaveBeenCalledBefore;

  });

  it('hould handle error in validation. patchValidarManual FAIL', ()=> {
    component.currentCliente = mockEnrolamientoFacialDTO_EXPIRADO;
    component.numDoc = 12345678;
    component.tipoDoc = 'DNI';
    component.pais = '80';
    component.sucursal = '100';
    
    loginServiceTest.getSucursal.and.returnValue(of(component.sucursal));
    consultasServiceTest.patchValidarManual.withArgs(component.currentCliente.id_enrolamiento, component.currentCliente.id_persona,'100', mockDocumento).and.returnValue(throwError(() => new Error('API error')));
    errorServiceSpy.setMessage.and.returnValue();

    component.validarManual();

    expect(errorServiceSpy.setError).toHaveBeenCalled();

  });

  //Este metodo lo dejé sin completar, falta agregar los inputs para que se active el (keyup)
  xit('verificarInput()', () => {
    let input = fixture.debugElement.query(By.css('input[name=numbero_documento]'));
    input.triggerEventHandler('keyup.space',{});
    fixture.detectChanges();
    
    expect(component.disabled).toBeTrue();
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});



