import { Error } from './error';

export class ErrorResponse {
    codigo: number;
    estado: string;
    tipo: string;
    detalle: string;
    errores: Error[];
}
