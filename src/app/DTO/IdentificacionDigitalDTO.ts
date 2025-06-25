import {EstadoTramite} from './EstadoTramite';

export class IdentificacionDigitalDTO {
    estado: EstadoTramite;
    documento_vigente: boolean;
    porcentaje_similitud_renaper: string;
    codigo_respuesta_renaper: string;
    mensaje_error_renaper: string;
    id_tramite: string;
}