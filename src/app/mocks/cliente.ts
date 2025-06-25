import { Cliente } from "../DTO/cliente";
import { domicilioMock } from "./domicilio";
import { emailsMock } from "./email";
import { mockTelefono } from "./telefono";

export const mockCliente: Cliente = {
    id_persona: '1111',
    cuil: '20123456783',
    fechaNacimiento: '10-01-1990',
    genero: 'M',
    perfil_biometrico: true,
    nombre: 'Juan',
    apellido: 'Pérez',
    numero_documento: '12345678',
    pais_documento: '80',
    tipo_documento: '4',
    tipoSimboloDocumento: 'DNI',
    pais_documento_descripcion: 'Argentina',
    problemas_enrolamiento: false,
    telefonos: [mockTelefono],
    domicilios: [domicilioMock],
    emails: emailsMock,
    es_empleado: false,
    generoDesc: 'Masculino',
    fecha_enrolamiento: '2013-08-12T11:22:55.530Z',
    fecha_ultima_actualizacion: '2023-08-12T11:22:55.530Z',
    sucursal_enrolamiento: '100',
    usuario_enrolamiento: 'admin',
    usuario_actualizacion: 'admin2',
    fecha_ultima_identificacion: null,
    fecha_ultima_verificacion: null
  };