import { Cliente } from "../DTO/cliente";
import { EnrolamientoFacialDTO } from "../DTO/EnrolamientoFacialDTO";
import { EstadoTramite } from "../DTO/EstadoTramite";
import { IdentificacionDigitalDTO } from "../DTO/IdentificacionDigitalDTO";

export const mockEnrolamientoFacialDTO_EN_PROCESO: EnrolamientoFacialDTO = {
    id_enrolamiento: new Uint8Array(20212224),
    id_persona: '12401',
    similitud_obtenida_plantilla_facial_extendida: 0.97,
    status_obtenido_plantilla_facial_extendida: 'POSITIVE',
    estado_enrolamiento: 'EXPIRE',
    identificacion_digital: {
        estado: EstadoTramite.EN_PROCESO,
        documento_vigente: false,
        porcentaje_similitud_renaper: '25.5',
        codigo_respuesta_renaper: '2025',
        mensaje_error_renaper: 'No se pudo validar la imagen debido a su mala calidad.'
    } as IdentificacionDigitalDTO,
    autenticacion_habilitada: true,
    validado_manualmente: false,
    canal_de_origen: 'WEB',
    last_ok_validation_date: '2024-02-18T12:00:00Z',
    registration_date: '2024-02-01T08:30:00Z',
    cliente: new Cliente
};

export const mockEnrolamientoFacialDTO_CONFIRMADO: EnrolamientoFacialDTO = {
    id_enrolamiento: new Uint8Array(20212223),
    id_persona: '12401',
    similitud_obtenida_plantilla_facial_extendida: 0.97,
    status_obtenido_plantilla_facial_extendida: 'POSITIVE',
    estado_enrolamiento: 'CONFIRMED',
    identificacion_digital: {
        estado: EstadoTramite.CONFIRMADO,
        documento_vigente: false,
        porcentaje_similitud_renaper: '25.5',
        codigo_respuesta_renaper: '2025',
        mensaje_error_renaper: 'No se pudo validar la imagen debido a su mala calidad.'
    } as IdentificacionDigitalDTO,
    autenticacion_habilitada: true,
    validado_manualmente: false,
    canal_de_origen: 'WEB',
    last_ok_validation_date: '2024-02-18T12:00:00Z',
    registration_date: '2024-02-01T08:30:00Z',
    cliente: {
        apellido: 'Test1',
        nombre:'Unit',
        id_persona: '12401',
        numero_documento:'111',
        tipo_documento:'DNI'
    }as Cliente
};
export const mockEnrolamientoFacialDTO_ELIMINADO: EnrolamientoFacialDTO = {
    id_enrolamiento: new Uint8Array(2021234),
    id_persona: '12401',
    similitud_obtenida_plantilla_facial_extendida: 0.97,
    status_obtenido_plantilla_facial_extendida: 'POSITIVE',
    estado_enrolamiento: 'DELETED',
    identificacion_digital: {
        estado: EstadoTramite.EN_PROCESO,
        documento_vigente: false,
        porcentaje_similitud_renaper: '25.5',
        codigo_respuesta_renaper: '2025',
        mensaje_error_renaper: 'No se pudo validar la imagen debido a su mala calidad.'
    } as IdentificacionDigitalDTO,
    autenticacion_habilitada: false,
    validado_manualmente: false,
    canal_de_origen: 'MOBI',
    last_ok_validation_date: '2024-02-18T12:00:00Z',
    registration_date: '2024-02-01T08:30:00Z',
    cliente: {
        apellido: 'Test1',
        nombre:'Unit',
        id_persona: '12401',
        numero_documento:'111',
        tipo_documento:'DNI'
    }as Cliente
};

export const mockEnrolamientoFacialDTO_EXPIRADO: EnrolamientoFacialDTO = {
    id_enrolamiento: new Uint8Array(2021235),
    id_persona: '12401',
    similitud_obtenida_plantilla_facial_extendida: 0.97,
    status_obtenido_plantilla_facial_extendida: 'POSITIVE',
    estado_enrolamiento: 'EXPIRED',
    identificacion_digital: {
        estado: EstadoTramite.FALLIDO,
        documento_vigente: false,
        porcentaje_similitud_renaper: '25.5',
        codigo_respuesta_renaper: '2025',
        mensaje_error_renaper: 'No se pudo validar la imagen debido a su mala calidad.'
    } as IdentificacionDigitalDTO,
    autenticacion_habilitada: false,
    validado_manualmente: false,
    canal_de_origen: 'MOBI',
    last_ok_validation_date: '2024-02-18T12:00:00Z',
    registration_date: '2024-02-01T08:30:00Z',
    cliente: {
        apellido: 'Test1',
        nombre:'Unit',
        id_persona: '12401',
        numero_documento:'111',
        tipo_documento:'DNI'
    }as Cliente
};