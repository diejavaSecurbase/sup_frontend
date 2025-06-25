import { Cliente } from './cliente';
import {IdentificacionDigitalDTO} from './IdentificacionDigitalDTO';

export class EnrolamientoFacialDTO {
    id_enrolamiento: BigInteger;
    id_persona: string;
    similitud_obtenida_plantilla_facial_extendida: number;
    status_obtenido_plantilla_facial_extendida: string;
    estado_enrolamiento: string;
    identificacion_digital: IdentificacionDigitalDTO;
    autenticacion_habilitada: boolean;
    validado_manualmente: boolean;
    canal_de_origen: string;
    cliente: Cliente;
    last_ok_validation_date: string;
    registration_date: string;
}