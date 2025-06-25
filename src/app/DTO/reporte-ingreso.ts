import { Documento } from './documento';
export class ReporteIngreso {
  documento: Documento;
  nombreApellido: string;
  ususario: string;
  fecha: Date;
  tipoIdentificacion: string;
  nroCaja: string;
  cuenta: string;
  tipoAcceso: string;
  accion: string;
  tiempoPermanencia: string;

  numeroDocumento ?: string;
}
