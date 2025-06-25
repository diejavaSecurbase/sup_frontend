import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { BajaHuellaBiometricaComponent } from './baja-biometrica-huella.component';
import { ErrorService } from '../services/error.service';
import { ConsultasService } from '../services/HttpServices/consultas.service';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Cliente } from '../DTO/cliente';
import { DatosCliente } from '../DTO/DatosCliente';
import { DatosBajaCliente } from '../DTO/DatosBajaCliente';
import { AuditoriaCliente } from '../DTO/AuditoriaCliente';
import { EnvService } from '../env.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CheckboxControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../services/HttpServices/login.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { TipoDocumento } from '../DTO/tipo-documento';
import { Pais } from '../DTO/paises';
import { Domicilio } from '../DTO/domicilio';
import { Telefono } from '../DTO/telefono';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ListaDatosBajaCliente } from '../DTO/ListaDatosBajaCliente';
import { GeneralLoadsService } from '../services/general-loads.service';


describe('BajaHuellaBiometricaComponent', () => {
  let component: BajaHuellaBiometricaComponent;
  let fixture: ComponentFixture<BajaHuellaBiometricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BajaHuellaBiometricaComponent ],
      providers:[
        ConsultasService,
        LoginService,
        ErrorService,
        GeneralLoadsService,
        Cliente,
        DatosCliente,
        EnvService,
        IdentificacionCliente,
        MessageService,
        CheckboxControlValueAccessor        
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
    fixture = TestBed.createComponent(BajaHuellaBiometricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

 it('Success buscar()',() => {
    component.numDoc = 1;
    component.tipoDoc = ' ';
    component.pais = '80';
    component.currentCliente = null;
    fixture.detectChanges();
    let boton = fixture.debugElement.query(By.css('#btnbuscar'));
        
    let consultasServiceTest = TestBed.inject(ConsultasService);
    let spybuscar = spyOn(consultasServiceTest, 'buscarCliente').and.returnValue(of(new Cliente()));

    //Click
    boton.nativeElement.click();
    
    //EXPECTS
    expect(spybuscar).toHaveBeenCalled();
  });

  it('Success backToButtons()',()=>{
    component.currentCliente = null;
    let consultasServiceTest = TestBed.inject(ConsultasService);    
    let spybuscarAgain = spyOn(consultasServiceTest, 'setCurrentCliente').and.callFake(()=>{
    });
    component.backToButtons();

    expect(component.currentCliente).toBeNull();
    expect(component.currentCliente).toBeNull();
    expect(component.currentId).toBeNull();
    expect(component.numDoc).toBeNull();
    expect(component.numGestar).toBeNull();
  });

  it('Success buscarAgain',()=>{
    component.isLoading = false;
    let consultasServiceTest = TestBed.inject(ConsultasService);    
    let spybuscarAgain = spyOn(consultasServiceTest, 'setCurrentCliente').and.callFake(()=>{
    });

    component.buscarAgain();
    
    //EXPECTS
    expect(spybuscarAgain).toHaveBeenCalled();
    expect(component.currentCliente).toBeNull;
    expect(component.currentId).toBeNull;
    expect(component.numDoc).toBeNull;

  });

  it('Success showModalBajaBiometrica',()=>{
    component.showModalBajaBiometrica();

    expect(component.numGestar).toBeNull();
    expect(component.showModalBaja).toBeTrue();
  });

  it( 'Success cleanElementsBaja',()=>{
    component.cleanElementsBaja();
    let consultasServiceTest = TestBed.inject(ConsultasService);    
    
    expect(component.numGestar).toBeNull();
    expect(component.showModalBaja).toBeFalse();
    expect(component.currentCliente).toBeNull();
    expect(component.currentId).toBeNull();
    expect(component.numDoc).toBeNull();
    
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
  
});

function createCliente(){
  let cliente = new Cliente();
  cliente.id_persona='1234';
  cliente.perfil_biometrico=true;
  cliente.numero_documento='12345678';
  cliente.tipo_documento='4';
  cliente.pais_documento='80';
  return cliente;
}
function createListaDatosBajaCliente(){
  let listado = new ListaDatosBajaCliente();
  let datos = new DatosBajaCliente();
  datos.dbid = '80:4:12345678';
  datos.sucursal=100;
  datos.fecha_enrolamiento=new Date('10/02/2022');
  datos.fecha_ult_actualizacion=new Date('10/09/2023');
  datos.fecha_ult_identificacion=new Date('10/09/2023');
  datos.fecha_ult_verificacion=new Date('10/08/2023');  
  datos.usuario_enr='test1234';
  datos.usuario_act='test1234';
  datos.id_persona=12345;
  datos.nro_gestar='12345';
  datos.fecha_baja=new Date('09/11/2023'); 
  datos.usuario='test1234'; 
  datos.motivo_baja='test';
  listado.bajas= new Array(datos);
  return listado;
}
