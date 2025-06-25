import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AuditoriaRegistroUsuarioBiometricoComponent } from './auditoria-registro-usuario-biometrico.component';
import { ErrorService } from '../services/error.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Cliente } from '../DTO/cliente';
import { DatosCliente } from '../DTO/DatosCliente';
import { DatosBajaCliente } from '../DTO/DatosBajaCliente';
import { AuditoriaCliente } from '../DTO/AuditoriaCliente';
import { EnvService } from '../env.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../services/HttpServices/login.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { TipoDocumento } from '../DTO/tipo-documento';
import { Pais } from '../DTO/paises';
import { EMPTY, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { GeneralLoadsService }from '../services/general-loads.service';
import { mockCliente } from '../mocks/cliente';
import { mockIdentificacionCliente } from '../mocks/identificacionCliente';
import { mockEnrolamientoFacialDTO_EN_PROCESO } from '../mocks/enrolamientoFacialDto';
import { mockTipoDocumentos } from '../mocks/tipoDocumento';
import { mockPaises } from '../mocks/pais';
import { mockDatosBajaCliente } from '../mocks/datosBajaCliente';
import { mockAuditoriaCliente, mockAuditoriaClienteWithoutDate } from '../mocks/auditoriaCliente';

describe('AuditoriaRegistroUsuarioBiometricoComponent', () => {
  let component: AuditoriaRegistroUsuarioBiometricoComponent;
  let fixture: ComponentFixture<AuditoriaRegistroUsuarioBiometricoComponent>;
  let consultasServiceTest: jasmine.SpyObj<ConsultasService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let loginServiceTest: jasmine.SpyObj<LoginService>;
  let validacionesGeneralesTest: jasmine.SpyObj<GeneralLoadsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriaRegistroUsuarioBiometricoComponent ],
      providers:[
        ConsultasService,
        LoginService,
        ErrorService,
        GeneralLoadsService,
        Cliente,
        DatosCliente,
        DatosBajaCliente,
        AuditoriaCliente,
        EnvService,
        IdentificacionCliente,
        MessageService
        
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        MessagesModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consultasServiceTest = jasmine.createSpyObj('ConsultasService', [
      'getCurrentClienteObservable',
      'setCurrentCliente',
      'getCurrentIdObservable',
      'getTiposDocs',
      'getPaises',
      'buscarCliente',
      'getAuditoriasUsuario',
      'setCurrentCliente'

    ]);
    consultasServiceTest.getCurrentClienteObservable.and.returnValue(of(mockCliente));
    consultasServiceTest.getCurrentIdObservable.and.returnValue(of(mockIdentificacionCliente));
    consultasServiceTest.getTiposDocs.and.returnValue(of(mockTipoDocumentos));
    consultasServiceTest.getPaises.and.returnValue(of(mockPaises));        
    
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['setError','setMessage']);
    loginServiceTest = jasmine.createSpyObj('LoginService', ['getSucursal']);
    validacionesGeneralesTest = jasmine.createSpyObj('GeneralLoadsService', ['formatDateToString','verificarInput','onChangeDesde','formatDate']);

     TestBed.configureTestingModule({
      declarations: [AuditoriaRegistroUsuarioBiometricoComponent],
      providers: [{ provide: ConsultasService, useValue: consultasServiceTest},
        {provide: ErrorService, useValue: errorServiceSpy },
        {provide: LoginService, useValue:loginServiceTest },
        {provide: GeneralLoadsService, useValue: validacionesGeneralesTest}
      ]
    });

    fixture = TestBed.createComponent(AuditoriaRegistroUsuarioBiometricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', fakeAsync(() => {
    
    component.ngOnInit();

    //EXPECTS
    expect(component.currentCliente).not.toBeNull();
    expect(component.currentId).not.toBeNull();
    expect(component.tipoDoc).toEqual('DNI');
    expect(component.paisesOrigen.length).toEqual(3);
  }));

  it('Success buscar()',() => {
    component.numDoc = 1;
    component.tipoDoc = 'DNI';
    component.pais = '80';
    component.menuAuditoriaActive = true;
    component.fechaDesde= new Date('2025-01-10');
    component.fechaHasta= new Date('2025-02-20');
    consultasServiceTest.buscarCliente.withArgs( component.tipoDoc, component.numDoc,  component.pais).and.returnValue(of(mockCliente));
    spyOn(component, 'verificarFechas').and.returnValue(true);
    spyOn(component, 'cargaDatosAuditoria');
    fixture.detectChanges();

    component.buscar();

    expect(consultasServiceTest.buscarCliente).toHaveBeenCalled();
  });

  it('Should show error message if numDoc is missing', () => {
    component.numDoc = null;
    component.tipoDoc = 'DNI';
    component.pais = 'AR';

    component.buscar();

    expect(errorServiceSpy.setError).toHaveBeenCalled();
  });

  it('Should show error message if  the search fails', () => {
    component.numDoc = 10227620;
    component.tipoDoc = 'DNI';
    component.pais = 'AR';

    consultasServiceTest.buscarCliente.and.returnValue(throwError(() => new Error('Error en la búsqueda')));

    component.buscar();

    expect(component.numDoc).toBeNull();
  });
  

  it('Success backToButtons()',()=>{
    component.showSearch= true;
    component.currentCliente = null;
    component.buscarSoloPorFecha=false;
    component.showSoloPorFecha=false;
    consultasServiceTest.setCurrentCliente.call;
    component.backToButtons();

    expect(component.menuAuditoriaActive).toBeFalse();
    expect(component.buscarSoloPorFecha).toBeFalse();
    expect(component.showSearch).toBeFalse();
    expect(component.busquedaPorFecha).toBeFalse();
    expect(component.currentCliente).toBeNull();
    expect(component.fechaDesde).toBeNull();
    expect(component.fechaHasta).toBeNull();
    expect(component.showSoloPorFecha).toBeFalse();
    expect(component.searchTextAuditoria).toEqual('');
    expect(component.cantidadRegistros).toEqual(0);
    expect(component.currentCliente).toBeNull();
    expect(component.currentId).toBeNull();
    expect(component.numDoc).toBeNull();
    expect(component.auditorias).toEqual([]);
  });

  it('Success buscarAgain',()=>{
    component.isLoading = false;
    consultasServiceTest.setCurrentCliente.call;
    component.buscarAgain();
    
    //EXPECTS
    expect( consultasServiceTest.setCurrentCliente).toHaveBeenCalled();
    expect(component.currentCliente).toBeNull;
    expect(component.currentId).toBeNull;
    expect(component.numDoc).toBeNull;

  });
  
  it('should be return True when verificarInput is called', () => {
    let response = component.verificarInput('1234', 'documento');
    expect(response).toBeTrue;
  });

 it('should be return False when verificarInput is called', () => {
   let response = component.verificarInput('qwerty', 'documento');
   expect(response).toBeFalse;

});

it('should be return true when goToAuditoriaMenu is called', () => {
  component.goToAuditoriaMenu();

  expect(component.menuAuditoriaActive).toBeTrue();
  expect(component.busquedaPorFecha).toBeTrue();
  expect(component.showSearch).toBeTrue();
});

it('Success nombreTipoOperacion',()=>{
 
  expect(component.nombreTipoOperacion("I")).toEqual("Identificación");
  expect(component.nombreTipoOperacion("V")).toEqual("Verificación");
  expect(component.nombreTipoOperacion("E")).toEqual("Enrolamiento");
  expect(component.nombreTipoOperacion("G")).toEqual("Generalización");
  expect(component.nombreTipoOperacion("A")).toEqual("Actualización");
  expect(component.nombreTipoOperacion("R")).toEqual("Re-Enrolamiento");
  expect(component.nombreTipoOperacion("B")).toEqual("Baja");
});

it('Success constructPaisTipoNroDoc',()=>{
    let response = component.constructPaisTipoNroDoc('80:4:12345678');
    expect(response).not.toBeNull();
});

it('Success aplicarFiltroAuditorias',()=>{
  let response = component.aplicarFiltroAuditorias(mockAuditoriaCliente);
  expect(response).toBeTrue();
});

it('Success searchInTableAuditorias',()=>{
  component.datosUsuarioAuditoria = [mockAuditoriaCliente];
  fixture.detectChanges();

  component.searchInTableAuditorias();
  
  expect(component.auditorias).not.toBeNull();
});
it('onChangeDesde Success',()=>{
  
  component.fechaDesde = new Date('01-03-2024');
  component.fechaHoy= new Date('07-03-2024');
  fixture.detectChanges();
  component.onChangeDesde();

  expect(component.maxDateHasta).not.toBeNull();

});

it('Success aplicarFiltroAuditorias',() =>{
  const testCases = [mockAuditoriaClienteWithoutDate.tipo_operacion, mockAuditoriaClienteWithoutDate.idusuario, mockAuditoriaClienteWithoutDate.resultado, mockAuditoriaClienteWithoutDate.canal, mockAuditoriaClienteWithoutDate.detalle, mockAuditoriaClienteWithoutDate.score, mockAuditoriaClienteWithoutDate.sucursal];
  testCases.forEach(value => {
    component.searchTextAuditoria = value;
    fixture.detectChanges();
    
    let response = component.aplicarFiltroAuditorias(mockAuditoriaClienteWithoutDate);
    expect(response).toBeTrue();
  }); 
});

it('should update attributeData.header', () => {
  component.datosUsuarioAuditoria = [mockAuditoriaCliente];
  
  component.showIndex(0);

  expect(component.attributeData.header).toBe('Parámetros y Detalles');
});

it('should disable isLoading before and after the query', () => {
  component.currentCliente =mockCliente;
  component.fechaDesde = new Date('2024-01-01');
  component.fechaHasta = new Date('2024-12-31');
  validacionesGeneralesTest.formatDateToString.and.returnValue('01/01/2024');

  consultasServiceTest.getAuditoriasUsuario.and.returnValue(of({ auditorias: [] }));

  component.cargaDatosAuditoria();

  expect(component.isLoading).toBeFalse();
});
 it('should call searchInTableAuditorias', () => {
  spyOn(component, 'searchInTableAuditorias');
  consultasServiceTest.getAuditoriasUsuario.and.returnValue(of({ auditorias: [] }));

  component.cargaDatosAuditoria();

  expect(component.searchInTableAuditorias).toHaveBeenCalled();
}); 

  afterAll(() => {
    TestBed.resetTestingModule();
  });
  
});


