import { AuditoriaCliente } from "../DTO/AuditoriaCliente";

export const mockAuditoriaCliente: AuditoriaCliente = {
    fecha: new Date(),
    tipo_operacion: 'g',
    idusuario: '80:4:12345678',
    duracion_ms: 8609,
    resultado: 'OK',
    detalle: 'Consulta realizada correctamente',
    parametros: '[(MISC=10.241.162.104), (USER=er79135), (CANAL=PORTALCLIENTES)}]',
    canal: 'PORTALCLIENTES',
    sucursal: '100',
    score:'85',
    highlighted:['FECHA', 'ID_USUARIO'],
    posicionLista: 1
}
export const mockAuditoriaClienteWithoutDate: AuditoriaCliente = {
    fecha: null,
    tipo_operacion: 'g',
    idusuario: '80:4:12345678',
    duracion_ms: 8609,
    resultado: 'OK',
    detalle: 'Consulta realizada correctamente',
    parametros: '[(MISC=10.241.162.104), (USER=er79135), (CANAL=PORTALCLIENTES)}]',
    canal: 'PORTALCLIENTES',
    sucursal: '100',
    score:'85',
    highlighted:['FECHA', 'ID_USUARIO'],
    posicionLista: 1
}