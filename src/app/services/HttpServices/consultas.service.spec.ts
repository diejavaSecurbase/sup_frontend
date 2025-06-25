import { TestBed } from '@angular/core/testing';

import { ConsultasService } from './consultas.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { EnvService } from 'src/app/env.service';
import { MessageService } from 'primeng/api';
import { LoginService } from './login.service';
import { IdentificacionCliente } from 'src/app/DTO/identificacion-cliente';
import { Cliente } from 'src/app/DTO/cliente';
import { DomicilioTelefono } from 'src/app/DTO/domicilioTelefono';
import { IdentificacionBiometrica } from 'src/app/DTO/identificacion-biometrica';
import { HuellaBack } from 'src/app/DTO/huella-back';
import { Documento } from 'src/app/DTO/documento';
import { isRegExp } from 'util';
import { Domicilio } from 'src/app/DTO/domicilio';
import { Telefono } from 'src/app/DTO/telefono';
import { Generalizacion } from 'src/app/DTO/generalizacion';
import { Pais } from 'src/app/DTO/paises';
import { EnrolamientoFacialDTO } from 'src/app/DTO/EnrolamientoFacialDTO';
import { IdentificacionDigitalDTO } from 'src/app/DTO/IdentificacionDigitalDTO';
import { EstadoTramite } from 'src/app/DTO/EstadoTramite';

describe('ConsultasService', () => {
  let service: ConsultasService;
  let httpMock: HttpTestingController;
  let env: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ConsultasService, HttpClient, ErrorService, EnvService, MessageService, LoginService]
    });
    service = TestBed.inject(ConsultasService);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(EnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encontrar el detalle de un identificador de cliente', () => {
    let idCliente: IdentificacionCliente = {id_persona: '103', pais_documento: '80', numero_documento: '20202012', perfil_biometrico: false, tipo_documento: '4',fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let dummyReply: Cliente = {genero: 'M', apellido: 'jorgito', tipo_documento: '4', problemas_enrolamiento: false, nombre: 'jorgitoNombre', pais_documento: '80', pais_documento_descripcion: 'aca', es_empleado: false, id_persona: '103', numero_documento: '20202012', perfil_biometrico: null, cuil: '1035', domicilios: null, telefonos: null, fechaNacimiento: null, tipoSimboloDocumento: 'DNI', emails: [],fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};

    service.getDetalleCliente(idCliente).subscribe(success => {
      expect(success).toEqual(dummyReply);
    })

    let req = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idCliente.id_persona + "/detalle?numero_documento=" + idCliente.numero_documento + '&pais_documento=' + idCliente.pais_documento + '&tipo_documento=' + idCliente.tipo_documento);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReply);
  })

  it('should encontrar un cliente usando su documento', () => {
    let idCliente: IdentificacionCliente = {id_persona: '103', pais_documento: '80', numero_documento: '20202012', perfil_biometrico: false, tipo_documento: '4',fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let dummyReply: Cliente = {genero: 'M', apellido: 'jorgito', tipo_documento: '4', problemas_enrolamiento: false, nombre: 'jorgitoNombre', pais_documento: '80', pais_documento_descripcion: 'aca', es_empleado: false, id_persona: '103', numero_documento: '20202012', perfil_biometrico: null, cuil: '1035', domicilios: null, telefonos: null, fechaNacimiento: null, tipoSimboloDocumento: 'DNI', emails: [],fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};

    service.buscarCliente('4', '20202012', '80').subscribe(success => {
      expect(success).toEqual(dummyReply);
    })

    let reqId = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.buscarCliente + "?numero_documento=" + idCliente.numero_documento + '&pais_documento=' + idCliente.pais_documento + '&tipo_documento=' + idCliente.tipo_documento);
    expect(reqId.request.method).toBe("GET");
    reqId.flush(idCliente);

    let req = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idCliente.id_persona + "/detalle?numero_documento=" + idCliente.numero_documento + '&pais_documento=' + idCliente.pais_documento + '&tipo_documento=' + idCliente.tipo_documento);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReply);
  })

  it('should darme los numeros y domicilios del cliente', () => {
    let cliente: Cliente = {genero: 'M', apellido: 'jorgito', tipo_documento: '4', problemas_enrolamiento: false, nombre: 'jorgitoNombre', pais_documento: '80', pais_documento_descripcion: 'aca', es_empleado: false, id_persona: '103', numero_documento: '20202012', perfil_biometrico: null, cuil: '1035', domicilios: null, telefonos: null, fechaNacimiento: null, tipoSimboloDocumento: 'DNI', emails: [], fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let telefonoDomicilios: DomicilioTelefono = {
      domicilios: [{
        calle: 'gral. jorgito',
        codigoPostal: 'xd123',
        departamento: null,
        legal: true,
        localidad_codigo: '123',
        localidad_descripcion: 'Tandil',
        numero: '13',
        piso: null,
        pais_codigo: '80',
        pais_descripcion: 'aca',
        provincia_codigo: '231',
        provincia_descripcion: 'Tandil'
      }],
      telefonos: [{
        codigoArea: '123',
        numero: '171717',
        operador: 'telefonia supervielle',
        tipo: 'CELULAR'
      }]
    }
    service.getDomicilioYTelefono(cliente).subscribe(success => {
      expect(success).toEqual(telefonoDomicilios);
    })

    let req = httpMock.expectOne(env.apiUrl + '/clientes/v1.0/' + cliente.id_persona + "/domicilioYTelefono?numero_documento=" + cliente.numero_documento + '&pais_documento=' + cliente.pais_documento + '&tipo_documento=' + cliente.tipo_documento)
    expect(req.request.method).toBe('GET');
    req.flush(telefonoDomicilios);
  })

  it('should verificar cliente', () => {
    let idCliente: IdentificacionCliente = {id_persona: '103', pais_documento: '80', numero_documento: '20202012', perfil_biometrico: true, tipo_documento: '4',fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let idBiometrica: IdentificacionBiometrica = {codigo_pais: '80', descripccion: 'descripccion', idPersona: '103', numero_documento: '20202012', tipo_documento: '4',fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};
    let dummyReply: Cliente = {genero: 'M', apellido: 'jorgito', tipo_documento: '4', problemas_enrolamiento: false, nombre: 'jorgitoNombre', pais_documento: '80', pais_documento_descripcion: 'aca', es_empleado: false, id_persona: '103', numero_documento: '20202012', perfil_biometrico: null, cuil: '1035', domicilios: null, telefonos: null, fechaNacimiento: null, tipoSimboloDocumento: 'DNI', emails: [],fecha_enrolamiento:'2013-08-12T11:22:55.530Z', fecha_ultima_actualizacion:'2023-08-12T11:22:55.530Z',fecha_ultima_identificacion: null, fecha_ultima_verificacion:null, usuario_actualizacion:'test123', usuario_enrolamiento:'test123', sucursal_enrolamiento:'100'};

    let huellas: HuellaBack[] = [{dedo: 'PULGAR_DERECHO', estado_huella: 'TOMADA', imagen: 'imagen', nfiq: '1', origen: 'DESCONOCIDO', template: 'template'}];
    service.verificarCliente(huellas, {numero: '20202012', tipo: '4', pais: '80'}).subscribe(success => {
      expect(success).toEqual(dummyReply);
    });

    let reqId = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.buscarCliente + "?numero_documento=" + idCliente.numero_documento + '&pais_documento=' + idCliente.pais_documento + '&tipo_documento=' + idCliente.tipo_documento + '&es_verificacion=true');
    expect(reqId.request.method).toBe("GET");
    reqId.flush(idCliente);

    let reqIdentificacion = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.identificacionBiometrica);
    expect(reqIdentificacion.request.method).toBe('POST');
    reqIdentificacion.flush(idBiometrica);

    let req = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.detalleCliente + idCliente.id_persona + "/detalle?numero_documento=" + idCliente.numero_documento + '&pais_documento=' + idCliente.pais_documento + '&tipo_documento=' + idCliente.tipo_documento);
    expect(req.request.method).toBe('GET');
    req.flush(dummyReply);
  })

  it('should generalizar huellas', () => {
    let huellas: HuellaBack[] = [{dedo: 'PULGAR_DERECHO', estado_huella: 'TOMADA', imagen: 'imagen', nfiq: '1', origen: 'DESCONOCIDO', template: 'template'}];
    let documento: Documento = {numero: '20202012', tipo: '4', pais: '80'};
    let idCliente = '123';
    service.generalizarHuellas(huellas, documento, idCliente).subscribe();

    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.generalizar + idCliente + '/generalizar');
    expect(req.request.body).toEqual({documento, huellas});
  })

  it('should enrolar un cliente', () => {
    let huellas = [[{dedo: 'PULGAR_DERECHO', estado_huella: 'TOMADA', imagen: 'imagen', nfiq: '1', origen: 'DESCONOCIDO', template: 'template'}]];
    let documento: Documento = {numero: '20202012', tipo: '4', pais: '80'};
    let idCliente = '123';
    let domicilio: Domicilio = {
      calle: 'gral. jorgito',
      codigoPostal: 'xd123',
      departamento: null,
      legal: true,
      localidad_codigo: '123',
      localidad_descripcion: 'Tandil',
      numero: '13',
      piso: null,
      pais_codigo: '80',
      pais_descripcion: 'aca',
      provincia_codigo: '231',
      provincia_descripcion: 'Tandil'
    };
    let telefono: Telefono = {
      codigoArea: '123',
      numero: '171717',
      operador: 'telefonia supervielle',
      tipo: 'CELULAR'
    };
    let huellas_no_tomadas = null;
    let aplicacion = 'BIOMETRIA';
    let generalizaciones_template: Generalizacion[] = [{dedo: 'dedo', template: 'template'}];
    let cuil = '123';

    service.enrolar(cuil, documento, domicilio, generalizaciones_template, huellas, telefono, idCliente, huellas_no_tomadas, aplicacion).subscribe();

    const huellasTotal = [];

    huellas.forEach(huellaArray => {
      huellaArray.forEach(huella => {
        huellasTotal.push(huella);
      });
    });


    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.enrolar + idCliente + '/enrolar');
    expect(req.request.body).toEqual({cuil, documento, domicilio, generalizaciones_template, huellas_scaneadas: huellasTotal, telefono, huellas_no_tomadas});
  })

  it('should enrolar un cliente', () => {
    let huellas = [[{dedo: 'PULGAR_DERECHO', estado_huella: 'TOMADA', imagen: 'imagen', nfiq: '1', origen: 'DESCONOCIDO', template: 'template'}]];
    let documento: Documento = {numero: '20202012', tipo: '4', pais: '80'};
    let idCliente = '123';
    let domicilio: Domicilio = {
      calle: 'gral. jorgito',
      codigoPostal: 'xd123',
      departamento: null,
      legal: true,
      localidad_codigo: '123',
      localidad_descripcion: 'Tandil',
      numero: '13',
      piso: null,
      pais_codigo: '80',
      pais_descripcion: 'aca',
      provincia_codigo: '231',
      provincia_descripcion: 'Tandil'
    };
    let telefono: Telefono = {
      codigoArea: '123',
      numero: '171717',
      operador: 'telefonia supervielle',
      tipo: 'CELULAR'
    };
    let huellas_no_tomadas = null;
    let aplicacion = 'BIOMETRIA';
    let generalizaciones_template: Generalizacion[] = [{dedo: 'dedo', template: 'template'}];
    let cuil = '123';

    service.actualizar(cuil, documento, domicilio, generalizaciones_template, huellas, telefono, idCliente, huellas_no_tomadas, aplicacion).subscribe();

    const huellasTotal = [];

    huellas.forEach(huellaArray => {
      huellaArray.forEach(huella => {
        huellasTotal.push(huella);
      });
    });


    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.enrolar + idCliente + '/actualizar');
    expect(req.request.body).toEqual({cuil, documento, domicilio, generalizaciones_template, huellas_scaneadas: huellasTotal, telefono, huellas_no_tomadas});
  })

  it('should use el cache en vez de la request', () => {
    let paises: Pais[] = [{descripcion: 'unPais', orden: 1}, {orden: 2, descripcion: 'otroPais'}];

    service.getPaises().subscribe(success => {
      expect(success).toEqual(paises);
      service.getPaises().subscribe(success2 => {
        expect(success2).toEqual(paises);
      })
    },
    error => {
      fail();
    })

    let req = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.paises);
    expect(req.request.method).toBe('GET');
    req.flush(paises);
    
    httpMock.expectNone(env.apiUrl + ConsultasService.ENDPOINTS.paises);

  })

  it('should fallar al consultar pais', () => {
    let paises: Pais[] = [{descripcion: 'unPais', orden: 1}, {orden: 2, descripcion: 'otroPais'}];

    service.getPaises().subscribe(success => {
      fail();
    },
    error => {
      expect(error.status).toEqual(404);
    })

    let req = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.paises);
    expect(req.request.method).toBe('GET');
    req.flush(paises, {status: 404, statusText: 'Not found'});

  })

  it('should eliminar enrolamiento facial', () => {
    let idEnrolamiento = '12345';
    let doc = mockDocumento();
    service.deleteEnrolamientoFacial(idEnrolamiento, doc).subscribe();
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.deleteEnrolamientoFacial + idEnrolamiento+"?numero_documento=" + doc.numero + '&pais_documento=' + doc.pais + '&tipo_documento=' + doc.tipo );
    expect(req.request.method).toBe('DELETE');
  })
 
  it('should be getClienteEnrollFacial', () => {
    let documento = mockDocumento();
    let dummyReply = createEnrolamientoConfirmado();
    service.getClienteEnrollFacial(documento.tipo,documento.numero, documento.pais).subscribe(
      success => {
        expect(success).toEqual(dummyReply);
    });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.enrolamientoFacial + "?numero_documento=" + documento.numero + '&tipo_documento=' + documento.tipo + '&pais_documento=' + documento.pais);
    expect(req.request.method).toBe('GET');
  })

  it('should Fail getClienteEnrollFacial', () => {
    let documento = mockDocumento();
    service.getClienteEnrollFacial(documento.tipo,documento.numero, documento.pais).subscribe(
      success => { fail();
      },
      error => {
        expect(error.status).toEqual(404);
    });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.enrolamientoFacial + "?numero_documento=" + documento.numero + '&tipo_documento=' + documento.tipo + '&pais_documento=' + documento.pais);
    expect(req.request.method).toBe('GET');
  })
  
  it('should be postTelefono', () => {
    let idCliente='1234';
    let documento = mockDocumento();
    let telefono = mockTelefono();   
    
    service.postTelefono(idCliente,telefono.tipo,null,telefono.numero,telefono.codigoArea,documento).subscribe();
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + "/telefono?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('POST');
  })
  it('should fail postTelefono', () => {
    let idCliente='1234';
    let documento = mockDocumento();
    let telefono = mockTelefono();   
    
    service.postTelefono(idCliente,telefono.tipo,null,telefono.numero,telefono.codigoArea,documento).subscribe(
      success => { fail();
    },
    error => {
      expect(error.status).toEqual(404);
  });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + "/telefono?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('POST');
  })
  it('should be patchTelefono', () => {
    let idCliente='1234';
    let id='5555';
    let telefono = mockTelefono();
    let documento = mockDocumento();   
    
    service.patchTelefono(idCliente,id,telefono.tipo,null,telefono.numero,telefono.codigoArea,documento).subscribe();
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/telefono/' + id + "?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('PATCH');
  })

  it('should FAIL patchTelefono', () => {
    let idCliente='1234';
    let id='5555';
    let telefono = mockTelefono();
    let documento = mockDocumento();   
    
    service.patchTelefono(idCliente,id,telefono.tipo,null,telefono.numero,telefono.codigoArea,documento).subscribe(
      success => { fail();
      },
      error => {
        expect(error.status).toEqual(404);
    });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/telefono/' + id + "?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('PATCH');
  })

  it('should be PostMail', () => {
    let idCliente='1234';
    let mail='unit-test@unit.com';
    let documento = mockDocumento();   
    
    service.postMail(idCliente,mail,documento).subscribe();
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail' +"?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('POST');
  })
  it('should FAIL PostMail', () => {
    let idCliente='1234';
    let mail='unit-test@unit.com';
    let documento = mockDocumento();   
    
    service.postMail(idCliente,mail,documento).subscribe(success => { fail();
    },
    error => {
      expect(error.status).toEqual(404);
  });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail' +"?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('POST');
  })
  it('should be PatchMail', () => {
    let idCliente='1234';
    let mail='unit-test@unit.com';
    let id ='123';
    let documento = mockDocumento();   
    
    service.patchMail(idCliente,id,mail,documento).subscribe();
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail/' + id +"?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('PATCH');
  })
  it('should FAIL PatchMail', () => {
    let idCliente='1234';
    let mail='unit-test@unit.com';
    let id ='123';
    let documento = mockDocumento();   
    
    service.patchMail(idCliente,id,mail,documento).subscribe(success => { fail();
    },
    error => {
      expect(error.status).toEqual(404);
  });
    let req  = httpMock.expectOne(env.apiUrl + ConsultasService.ENDPOINTS.postTelefono + idCliente + '/mail/' + id +"?numero_documento=" + documento.numero + '&pais_documento=' + documento.pais + '&tipo_documento=' + documento.tipo);
    expect(req.request.method).toBe('PATCH');
  })
  function createEnrolamientoConfirmado() {
    let enrolamientoFacialDTO = new EnrolamientoFacialDTO();
    enrolamientoFacialDTO.id_persona = '12401';
    enrolamientoFacialDTO.id_enrolamiento = new Uint8Array(20212223);
    enrolamientoFacialDTO.similitud_obtenida_plantilla_facial_extendida = 0.97;
    enrolamientoFacialDTO.status_obtenido_plantilla_facial_extendida = 'POSITIVE';
    enrolamientoFacialDTO.estado_enrolamiento = 'CONFIRMED';
    enrolamientoFacialDTO.autenticacion_habilitada = false;
    enrolamientoFacialDTO.validado_manualmente = false;
    let identificacionDigitalDTO = new IdentificacionDigitalDTO();
    identificacionDigitalDTO.id_tramite='12345';
    identificacionDigitalDTO.estado = EstadoTramite.EN_PROCESO;
    identificacionDigitalDTO.documento_vigente = false;
    identificacionDigitalDTO.porcentaje_similitud_renaper = '85.5';
    enrolamientoFacialDTO.identificacion_digital = identificacionDigitalDTO;
    let clienteDto = new Cliente();
    clienteDto.apellido= 'Test1';
    clienteDto.nombre='Unit';
    clienteDto.id_persona= '12401';
    clienteDto.numero_documento='111';
    clienteDto.tipo_documento='';
    enrolamientoFacialDTO.cliente= clienteDto;
    
    return enrolamientoFacialDTO;
  }
  function mockDocumento(){
    
    let documento = new Documento();
    documento.numero='123455';
    documento.tipo='4';
    documento.pais='80';

    return documento; 
  };
  function mockTelefono(){
    let telefono = new Telefono();
    telefono.codigoArea = '351';
    telefono.numero= '987654';
    telefono.tipo='aa';
    return telefono;
  }
  
});
