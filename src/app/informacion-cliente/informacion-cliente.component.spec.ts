import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionClienteComponent } from './informacion-cliente.component';
import { Cliente } from '../DTO/cliente';
import { IdentificacionCliente } from '../DTO/identificacion-cliente';
import { Telefono } from '../DTO/telefono';
import { Domicilio } from '../DTO/domicilio';

describe('InformacionClienteComponent', () => {
  let component: InformacionClienteComponent;
  let fixture: ComponentFixture<InformacionClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionClienteComponent ],
      providers:[
        Cliente,
        IdentificacionCliente
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mostrar datos del cliente', () => {
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
	let cliente = {id_persona: '1111', cuil: '20123456783', fechaNacimiento: '10-01-2001', genero: 'M', perfil_biometrico: true, nombre:'Test', apellido: 'Unit', numero_documento: '12345678',pais_documento:'80',tipo_documento:'4', tipoSimboloDocumento:'dni', pais_documento_descripcion:'Argentina', problemas_enrolamiento: false, telefonos:[{codigoArea: '123',numero:'351234555',tipo:'cel', operador:'personal'}], domicilios:[{numero:'123',calle:'Av. Colon', departamento:'A',piso:'12',codigoPostal:'5000',pais_codigo:'80', pais_descripcion:'Argentina',provincia_codigo:'2', provincia_descripcion:'Cordoba',localidad_codigo:'221',localidad_descripcion:'Cordoba', legal:true}],emails:[], es_empleado: false, generoDesc:null,fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let idCliente = {id_persona:'1111', perfil_biometrico:true,numero_documento:'12345678',pais_documento:'80',tipo_documento:'4',fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    
    /*let cliente = new Cliente();
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
    let idCliente = new IdentificacionCliente();
    idCliente.id_persona = '1';
    idCliente.perfil_biometrico = true;
    idCliente.numero_documento = '41146570';
    idCliente.pais_documento = '1';
    idCliente.tipo_documento = '1';*/
    component.currentCliente=cliente;
    component.currentId=idCliente;
    fixture.detectChanges();
    component.ngOnInit();

    expect(component).toBeTruthy();
  });
});
