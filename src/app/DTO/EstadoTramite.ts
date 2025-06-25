export enum EstadoTramite {
    CONFIRMADO,
    EN_PROCESO,
    PENDIENTE_CONFIRMACION,
    RECHAZADO,
    FALLIDO
}

export const ALL: EstadoTramite[] = [
    EstadoTramite.CONFIRMADO,
    EstadoTramite.EN_PROCESO,
    EstadoTramite.PENDIENTE_CONFIRMACION,
    EstadoTramite.RECHAZADO,
    EstadoTramite.FALLIDO];