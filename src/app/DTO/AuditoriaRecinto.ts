
import { Documento } from './documento';
export class AuditoriaRecinto {

  doc: Documento = new Documento();
  nombreApellido: string;
  sucursal: string;
  tipoIdent: string;
  nroCaja: string;
  cuenta: string;
  tipoAcceso: string;
  accion: string;
  tiempo: number;

  clone(audit: AuditoriaRecinto): AuditoriaRecinto {
    const row = new AuditoriaRecinto();
    row.doc = audit.doc;
    row.nombreApellido = audit.nombreApellido;
    row.sucursal = audit.sucursal;
    row.tipoIdent = audit.tipoIdent;
    row.nroCaja = audit.nroCaja;
    row.cuenta = audit.cuenta;
    row.tipoAcceso = audit.tipoAcceso;
    row.accion = audit.accion;
    row.tiempo = audit.tiempo;
    return row;
  }

}
