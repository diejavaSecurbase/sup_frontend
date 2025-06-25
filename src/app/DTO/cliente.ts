import { Telefono } from './telefono';
import { Domicilio } from './domicilio';
import { Email } from './email';

export class Cliente {
    id_persona: string;
    cuil: string;
    fechaNacimiento: string;
    genero: string;
    perfil_biometrico: boolean;
    nombre: string;
    apellido: string;
    numero_documento: string;
    pais_documento: string;
    tipo_documento: string;
    tipoSimboloDocumento: string;
    pais_documento_descripcion: string;
    problemas_enrolamiento: boolean;
    telefonos: Telefono[];
    domicilios: Domicilio[];
    emails: Email[];
    es_empleado: boolean
    generoDesc ?: string;
    fecha_enrolamiento: string;
    fecha_ultima_actualizacion: string;
    sucursal_enrolamiento: string;
    usuario_enrolamiento: string;
    usuario_actualizacion: string;
    fecha_ultima_identificacion: string;
    fecha_ultima_verificacion: string;
}
