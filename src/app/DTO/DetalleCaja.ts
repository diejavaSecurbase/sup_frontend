import { PersonaAsociada } from './PersonaAsociada';

export class DetalleCaja {

  empresa: string;
  sucursal: string;
  cuenta: string;
  nroCajaSeguridad: string;
  nroContrato: string;
  fechaAltaContrato: string;
  fechaProxVto: string;
  fechaUltComision: string;
  cobertura: string;
  cobeturaEmpleados: string;
  fechaUltIng: string;
  horaUltIng: string;
  usuarioUltIng: string;
  monto: string;
  personas: PersonaAsociada[] = [];

}
