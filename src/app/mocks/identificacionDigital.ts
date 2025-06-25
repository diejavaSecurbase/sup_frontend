import { EstadoTramite } from "../DTO/EstadoTramite";
import { IdentificacionDigitalDTO } from "../DTO/IdentificacionDigitalDTO";

export const mockIdentificacionDigitalDTO_EN_PROCESO: IdentificacionDigitalDTO = {
    estado:EstadoTramite.EN_PROCESO,
    documento_vigente: false,
    porcentaje_similitud_renaper: "25.5",
    codigo_respuesta_renaper: "2025",
    mensaje_error_renaper: "No se pudo validar la imagen debido a su mala calidad.",
    id_tramite: "123456789"
};