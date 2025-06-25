import { ReporteIngreso } from "../DTO/reporte-ingreso";

export const mockReporteIngreso: ReporteIngreso [] = [
    {
      documento: {
          numero: "12345678",
          pais: "80",
          tipo: "4"
      },
      nombreApellido: 'Juan Pérez',
      ususario: 'jperez',
      fecha: new Date('2024-02-28T10:30:00Z'),
      tipoIdentificacion: 'I',
      nroCaja: '123',
      cuenta: '456789',
      tipoAcceso: 'VIP',
      accion: 'Ingreso',
      tiempoPermanencia: '30 minutos',
      numeroDocumento: '12345678'
    }];