import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReporteBajasComponent } from './reporte-bajas.component';
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
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { EMPTY, of, throwError } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { mockCliente } from '../mocks/cliente';
import { mockIdentificacionClienteReporteBaja } from '../mocks/identificacionCliente';
import { mockTipoDocumentos } from '../mocks/tipoDocumento';
import { mockPaises } from '../mocks/pais';
import { mockDatosBajaCliente } from '../mocks/datosBajaCliente';
import { GeneralLoadsService } from '../services/general-loads.service';
import { By } from '@angular/platform-browser';

describe('ReporteBajasComponent', () => {
  let component: ReporteBajasComponent;
  let fixture: ComponentFixture<ReporteBajasComponent>;
  let consultasServiceTest: jasmine.SpyObj<ConsultasService>;
  let validacionesGeneralesTest: jasmine.SpyObj<GeneralLoadsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteBajasComponent ],
      providers:[
        Cliente,
        DatosCliente,
        DatosBajaCliente,
        AuditoriaCliente,
        EnvService,
        IdentificacionCliente,
        MessageService,
        DropdownModule, 
        InputTextModule, 
        CalendarModule, 
        TableModule,
        ButtonModule
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
      'setCurrentCliente',
      'getCurrentClienteObservable',
      'getCurrentIdObservable',
      'getTiposDocs',
      'getPaises',
      'getRegistroUsuarioBajaPorFecha',
      'getRegistroUsuarioBaja',
      'buscarCliente'
    ]);
    
    consultasServiceTest.getCurrentClienteObservable.and.returnValue(of(mockCliente));
    consultasServiceTest.getCurrentIdObservable.and.returnValue(of(mockIdentificacionClienteReporteBaja));
    consultasServiceTest.getPaises.and.returnValue(of(mockPaises));
    consultasServiceTest.getTiposDocs.and.returnValue(of(mockTipoDocumentos));
    
    validacionesGeneralesTest = jasmine.createSpyObj('GeneralLoadsService', ['formatDateToString', 'formatDate','onChangeDesde']);

    TestBed.configureTestingModule({
      declarations: [ReporteBajasComponent],
      providers: [{ provide: ConsultasService, useValue: consultasServiceTest },
        {provide: GeneralLoadsService, useValue: validacionesGeneralesTest}
      ]
    });

    fixture = TestBed.createComponent(ReporteBajasComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should create', fakeAsync(() => {
        
    component.ngOnInit();

    expect(component.tipoDoc).toEqual('DNI');
    expect(component.paisesOrigen.length).toEqual(3);
    expect(component.currentCliente).not.toBeNull();
    expect(component.currentId).not.toBeNull();
    expect(component.numDoc).toBeNull();
    expect(consultasServiceTest.setCurrentCliente).toHaveBeenCalledWith(null, null);

  })); 
  
   it('should show documentpage when goToRegistroUsuarioBajaMenu is called', () => {
    fixture.detectChanges(); 
    component.goToRegistroUsuarioBajaMenu();
  
    expect(component.menuRegistroUsuarioBajaActive).toBeTrue();
    expect(component.showSearch).toBeTrue();
    expect(component.isBusquedaPorFecha).toBeFalse();
  }); 

  it('should show documentpage when goToRegistroUsuarioBajaPorFechaMenu is called', () => {

    fixture.detectChanges(); 
    component.goToRegistroUsuarioBajaPorFechaMenu();
  
    expect(component.showSearch).toBeTrue();
    expect(component.isBusquedaPorFecha).toBeTrue();
    expect(component.buscarSoloPorFecha).toBeTrue();
  
  }); 

   it('Success cargaDatosRegistroUsuarioDadoBajaPorFecha',() => {  

    spyOn(component, 'validarInputsReporteBajaUsuario').and.returnValue(true);
    component.showSearch = true;
    component.buscarSoloPorFecha =true;
    component.fechaDesde=new Date('2024-08-07');
    component.fechaHasta=new Date('2024-08-08');
    component.cantidadRegistros=10;
    component.disabled=false;

    validacionesGeneralesTest.formatDateToString.withArgs(component.fechaDesde).and.returnValue('2024-08-07');
    validacionesGeneralesTest.formatDateToString.withArgs(component.fechaHasta).and.returnValue('2024-08-08');
    
    consultasServiceTest.getRegistroUsuarioBajaPorFecha.and.returnValue(of({bajas:[mockDatosBajaCliente]}));

    component.cargaDatosRegistroUsuarioDadoBajaPorFecha();
    fixture.detectChanges(); 

    expect(consultasServiceTest.getRegistroUsuarioBajaPorFecha).toHaveBeenCalledWith('2024-08-07', '2024-08-08', component.cantidadRegistros);
    expect(component.datosUsuarioBaja.length).toBe(1);
    expect(component.buscarSoloPorFecha).toBeFalse();
    expect(component.showSoloPorFecha).toBeTrue();
    expect(component.isLoading).toBeFalse();
  }); 

    it('Success cargaDatosRegistroUsuarioDadoBaja',() => {  
  
    component.showSearch = true;
    component.buscarSoloPorFecha =true;
    component.disabled=false;
    component.currentCliente=mockCliente;
    consultasServiceTest.getRegistroUsuarioBaja.and.returnValue(of({bajas:[mockDatosBajaCliente]}))
    component.cargaDatosRegistroUsuarioDadoBaja();

    fixture.detectChanges(); 

    expect(consultasServiceTest.getRegistroUsuarioBaja).toHaveBeenCalledWith(
      component.currentCliente.id_persona,
      component.currentCliente.numero_documento,
      component.currentCliente.pais_documento,
      component.currentCliente.tipo_documento
    );
    expect(component.datosUsuarioBaja.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });  

  it('Success Backbutton', () =>{
 
    component.showSearch=true;
    component.buscarSoloPorFecha=true;
    component.fechaDesde= new Date('2024-01-01');
    component.fechaHasta = new Date('2024-01-31');
    component.cantidadRegistros = 5;
    component.currentCliente=mockCliente;
    component.currentId=mockIdentificacionClienteReporteBaja;
    component.bajas=[mockDatosBajaCliente];    
    component.datosUsuarioBaja=[mockDatosBajaCliente];

    fixture.detectChanges();

    component.backToButtons();
    
    expect(component.menuRegistroUsuarioBajaActive).toBeFalse();
    expect(component.buscarSoloPorFecha).toBeFalse();    
    expect(component.showSearch).toBeFalse(); 
    expect(component.busquedaPorFecha).toBeFalse();  
    expect(component.showSoloPorFecha).toBeFalse();
    expect(component.currentCliente).toBeNull();
    expect(component.fechaDesde).toBeNull();
    expect(component.fechaHasta).toBeNull();
    expect(component.currentId).toBeNull();
    expect(component.numDoc).toBeNull();
    expect(component.searchTextBajas).toEqual("");
    expect(component.bajas).toEqual([]);

  });

   it('Should be true validarInputsReporteBajaUsuario', ()=>{
    
    component.fechaDesde = new Date('2024-12-11');
    component.fechaHasta = new Date('2025-02-02');
    component.cantidadRegistros=1;

    fixture.detectChanges();
    let response = component.validarInputsReporteBajaUsuario();
    
    expect(response).toBeTrue();

  });

   it('Should be false validarInputsReporteBajaUsuario', ()=>{
    
    component.fechaDesde = new Date();
    component.fechaHasta = null;
    component.cantidadRegistros=2;
  
    fixture.detectChanges();
    let response = component.validarInputsReporteBajaUsuario();
    
    expect(response).toBeFalse();

  });

   it('buscarAgain',()=>{
    
    fixture.detectChanges();
    component.buscarAgain();

    expect(component.currentCliente).toBeNull();
    expect(component.currentId).toBeNull();
    expect(component.numDoc).toBeNull();

  }); 

  it('When the search is success, should call `buscarCliente()` and `cargaDatosRegistroUsuarioDadoBaja()',()=>{
    spyOn(component, 'cargaDatosRegistroUsuarioDadoBaja');

    component.numDoc= 12345,
    component.tipoDoc = '4';
    component.pais = '80';
    consultasServiceTest.buscarCliente.and.returnValue(of(mockCliente));
    component.buscar();
    
    expect(consultasServiceTest.buscarCliente).toHaveBeenCalledWith('4',12345,'80');
    expect(component.cargaDatosRegistroUsuarioDadoBaja).toHaveBeenCalled();

  }); 
  it('debe manejar el error y limpiar `numDoc` si la búsqueda falla', () => {
    component.numDoc = 10227620;
    component.tipoDoc = '4';
    component.pais = '80';

    consultasServiceTest.buscarCliente.and.returnValue(throwError(() => new Error('Error en API')));

    component.buscar();

    expect(consultasServiceTest.buscarCliente).toHaveBeenCalledWith('4', 10227620, '80');
    expect(component.isLoading).toBeFalse();
    expect(component.numDoc).toBeNull();
  });

   it('aplicarFiltroBajas Success',()=>{
    fixture.detectChanges();
    let response = component.aplicarFiltroBajas(mockDatosBajaCliente);

    expect(response).toBeTrue(); 

  }); 

  
  it('constructBajaUserLabels - Success 1',()=>{
    
    fixture.detectChanges();

    let response = component.constructBajaUserLabels(mockDatosBajaCliente);

    expect(response).not.toBeNull();

  }); 
  
   it('FAIL validarFechaInpunt',()=>{
    component.currentId = mockCliente;
    fixture.detectChanges();
    
    let response = component.validarFechaInpunt(null, 'Desde');    
    expect(response).toBeFalse();

  }); 

  it('FAIL validaCantidadRegistros',()=>{
    fixture.detectChanges();
    let num = -1;

    let response = component.validaCantidadRegistros(num);
    expect(response).toBeFalse();

    }); 
     it('validateItem Fail',()=>{
      fixture.detectChanges();
      let item = null;
      let response = component.validateItem(item, 'x');

      expect(response).toBeFalse();
    }); 

     it('validateItem Success',()=>{
      
      fixture.detectChanges();
      let item = mockDatosBajaCliente.nro_gestar;
      let response = component.validateItem(item, mockDatosBajaCliente.nro_gestar);

      expect(response).toBeTrue();
    }); 
    
     it('onChangeDesde Success',()=>{
      
      component.fechaDesde = new Date('01-03-2024');
      component.fechaHoy= new Date('07-03-2024');

      validacionesGeneralesTest.onChangeDesde.withArgs(component.fechaDesde,component.fechaHoy).and.returnValue(new Date('2024-03-07'));
      fixture.detectChanges();
      component.onChangeDesde();

       expect(component.maxDateHasta).not.toBeNull();

    }); 

afterAll(() => {
    TestBed.resetTestingModule();
  });

  
});