import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { BiometriaComponent } from './biometria.component';
import { ErrorService } from '../services/error.service';
import { asapScheduler, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { LoginService } from '../services/HttpServices/login.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../DTO/cliente';
import { EMPTY, of } from 'rxjs';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { TipoDocumento } from '../DTO/tipo-documento';
import { Pais } from '../DTO/paises';
import { Domicilio } from '../DTO/domicilio';
import { Telefono } from '../DTO/telefono';
import { By } from '@angular/platform-browser';
import { EmptyExpr } from '@angular/compiler';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';
import { GeneralLoadsService } from '../services/general-loads.service';

//Clases Fake, sirven para reemplazar los imports de Router y ActivatedRoute.
class FakeActivatedRoute {}
class FakeRouter {
  navigate() {}
}

describe('BiometriaComponent', () => {
  let component: BiometriaComponent;
  let fixture: ComponentFixture<BiometriaComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [BiometriaComponent],
      providers: [
        ConsultasService,
        ErrorService,
        GeneralLoadsService,
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
    }).compileComponents();
  }));

  beforeEach(()=>{
    fixture = TestBed.createComponent(BiometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', fakeAsync(() => {
    //Creo todos los objetos necesarios
    let tel = new Telefono();
    tel.codigoArea = '234';
    tel.numero = '123123123';
    tel.tipo = 'celular';
    tel.operador = 'Tuenti';
    let dom = new Domicilio();
    dom.numero = '112';
    dom.calle = '9 De Julio';
    dom.departamento = 'A';
    dom.piso = '12';
    dom.codigoPostal = '1223';
    dom.pais_codigo = '80';
    dom.pais_descripcion = 'Argentina';
    dom.provincia_codigo = '1';
    dom.provincia_descripcion = 'Buenos Aires';
    dom.localidad_descripcion = 'Ciudad Autonoma de Buenos Aires';
    dom.localidad_codigo = '1';
    dom.legal = true;
    let cliente = new Cliente();
    cliente.id_persona = '2020';
    cliente.cuil = '20212223';
    cliente.fechaNacimiento = '11/11/11';
    cliente.genero = 'M';
    cliente.perfil_biometrico = true;
    cliente.nombre = 'Tester';
    cliente.apellido = 'Pro';
    cliente.numero_documento = '4141414141';
    cliente.pais_documento = '80';
    cliente.tipo_documento = 'dni';
    cliente.tipoSimboloDocumento = 'dni';
    cliente.pais_documento_descripcion = 'Argentina';
    cliente.problemas_enrolamiento = false;
    cliente.telefonos = [];
    cliente.telefonos.push(tel);
    cliente.domicilios = [];
    cliente.domicilios.push(dom);
    cliente.generoDesc = 'MASCULINO';
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spygetCurrentClienteObservable = spyOn(
      consultasServiceTest,
      'getCurrentClienteObservable'
    ).and.callFake(() => of(cliente));

    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';
    let spygetCurrentIdObservable = spyOn(
      consultasServiceTest,
      'getCurrentIdObservable'
    ).and.callFake(() => of(idCliente));

    let arrTipoDocumento: TipoDocumento[] = [];
    let tipoDocumento1: TipoDocumento = new TipoDocumento();

    tipoDocumento1.id = '1';
    tipoDocumento1.codigoSoa = 'cs1';
    tipoDocumento1.label = '1';
    tipoDocumento1.orden = 1;

    let tipoDocumento2: TipoDocumento = new TipoDocumento();

    tipoDocumento2.id = '2';
    tipoDocumento2.codigoSoa = 'cs2';
    tipoDocumento2.label = '2';
    tipoDocumento2.orden = 2;

    let tipoDocumento3: TipoDocumento = new TipoDocumento();

    tipoDocumento3.id = '3';
    tipoDocumento3.codigoSoa = 'cs3';
    tipoDocumento3.label = '3';
    tipoDocumento3.orden = 3;

    let tipoDocumento4: TipoDocumento = new TipoDocumento();

    tipoDocumento4.id = 'CUIT';
    tipoDocumento4.codigoSoa = 'cs3';
    tipoDocumento4.label = '3';
    tipoDocumento4.orden = 3;

    arrTipoDocumento.push(tipoDocumento1);
    arrTipoDocumento.push(tipoDocumento2);
    arrTipoDocumento.push(tipoDocumento3);
    let spygetTiposDocs = spyOn(
      consultasServiceTest,
      'getTiposDocs'
    ).and.callFake(() => of(arrTipoDocumento));

    let paises: Pais[] = [];

    let pais1 = new Pais();
    pais1.orden = 1;
    pais1.descripcion = 'Alemania';

    let pais2 = new Pais();
    pais2.orden = 2;
    pais2.descripcion = 'Brasil';

    let pais3 = new Pais();
    pais3.orden = 3;
    pais3.descripcion = 'Canada';

    paises.push(pais1);
    paises.push(pais2);
    paises.push(pais3);

    let spygetPaises = spyOn(consultasServiceTest, 'getPaises').and.returnValue(
      of(paises)
    );

    //Se llama al metodo ngOnInit() para poder crear la clase correctamente.
    component.ngOnInit();

    //EXPECTS
    expect(cliente).toBeTruthy();
    expect(spygetCurrentClienteObservable).toHaveBeenCalled();
    expect(spygetCurrentIdObservable).toHaveBeenCalled();
    expect(spygetTiposDocs).toHaveBeenCalled();
    expect(spygetPaises).toHaveBeenCalled();
    expect(component.tipoDoc).toEqual('cs1');
    expect(component.paisesOrigen.length).toEqual(3);
  }));

  it('buscar()', ()=>{
    let boton = fixture.debugElement.query(By.css('.boton-buscar'));
    component.numDoc = 1;
    component.tipoDoc = ' ';
    component.pais = ' ';
    fixture.detectChanges();
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spybuscarCliente = spyOn(consultasServiceTest, 'buscarCliente').and.returnValue(of(new Cliente()));

    //Click
    boton.nativeElement.click();
    
    //EXPECTS
    expect(spybuscarCliente).toHaveBeenCalled();
    
  });

  it('buscarAgain()', ()=>{
    let consultasServiceTest = TestBed.inject(ConsultasService);    
    let spybuscarCliente = spyOn(consultasServiceTest, 'setCurrentCliente').and.callFake(()=>{
    });

    component.buscarAgain();
    
    //EXPECTS
    expect(spybuscarCliente).toHaveBeenCalled();
    expect(component.currentCliente).toBeNull;
    expect(component.currentId).toBeNull;
    expect(component.numDoc).toBeNull;
    
  });

  it('FAIL consultas.getCurrentClienteObservable()', ()=>{
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spygetCurrentClienteObservable = spyOn(consultasServiceTest, 'getCurrentClienteObservable').and.returnValue(throwError(new Error()));


    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    expect(spygetCurrentClienteObservable).toHaveBeenCalled();
  })

  it('FAIL consultas.getTiposDocs()', ()=>{
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spygetTiposDocs = spyOn(consultasServiceTest, 'getTiposDocs').and.returnValue(throwError(new Error()));
    let faketiposDocs = [{label: "DNI", value: "4"}];
    

    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    expect(spygetTiposDocs).toHaveBeenCalled();
    expect(component.tiposDocs).toEqual(faketiposDocs);
    expect(component.tipoDoc).toEqual('4');
  })

   it('FAIL consultas.getPaises()', ()=>{
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spygetPaises = spyOn(consultasServiceTest, 'getPaises').and.returnValue(throwError(new Error()));
    let fakepaisesOrigen = [{label: "Argentina", value: 80}];


    //Ejecucion del ngOnInit()
    component.ngOnInit();
    //EXPECTS
    expect(spygetPaises).toHaveBeenCalled();
    expect(component.paisesOrigen).toEqual(fakepaisesOrigen);
    expect(component.pais).toEqual('80');
  })

    it('FAIL buscar()', ()=>{
    let boton = fixture.debugElement.query(By.css('.boton-buscar'));
    component.numDoc = 1;
    component.tipoDoc = ' ';
    component.pais = ' ';
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spybuscarCliente = spyOn(consultasServiceTest, 'buscarCliente').and.returnValue(throwError(new Error()));

    //Click
    boton.nativeElement.click();
    
    //EXPECTS
    expect(spybuscarCliente).toHaveBeenCalled();
    expect(component.numDoc).toEqual(null);
    
  });

  it('FAIL buscar()', ()=>{
    let boton = fixture.debugElement.query(By.css('.boton-buscar'));

    //Click
    boton.nativeElement.click();
    
  });

  it('should be return True when verificarInput is called', () => {
     let response = component.verificarInput('1234');
     expect(response).toBeTrue;
  });

  it('should be return False when verificarInput is called', () => {
    let response = component.verificarInput('qwerty');
    expect(response).toBeFalse;

 });

  //Este metodo lo dejé sin completar, falta agregar los inputs para que se active el (keyup)
  xit('verificarInput()', () => {
    let input = fixture.debugElement.query(By.css('input[name=numbero_documento]'));
    input.triggerEventHandler('keyup.space',{});
    // input.nativeElement.keyUp('1');

    fixture.detectChanges();
    
    expect(component.disabled).toBeTrue();
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
