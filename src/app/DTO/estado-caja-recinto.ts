export class EstadoCajaRecinto {
  cliente: string;
  apellidoNombre: string;
  identificacion: string;
  cajas: string;
  horaIngreso: number;

  clone(row: EstadoCajaRecinto): EstadoCajaRecinto {
    const copia = new EstadoCajaRecinto();
    copia.cliente = row.cliente;
    copia.apellidoNombre = row.apellidoNombre;
    copia.identificacion = row.identificacion;
    copia.cajas = row.cajas;
    copia.horaIngreso = row.horaIngreso;
    return copia;
  }

}
