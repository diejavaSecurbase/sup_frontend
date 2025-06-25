export class AuditoriaCliente {
    fecha: Date;
    tipo_operacion: string;
    idusuario: string;
    duracion_ms: number;
    resultado: string;
    detalle: string;
    parametros: string;
    canal: string;
    sucursal: string;
    score: string;
    highlighted: ColumnFilterNames[];
    posicionLista: number;
}

type ColumnFilterNames = 'REQUEST_ID' | 'FECHA' | 'TIPO_OPERACION' | 'ID_USUARIO' | 'DURACION_MS' | 'RESULTADO' | 'CANAL' | 'SUCURSAL' | 'DETALLE' | 'ESTADO_TEMPLATE' | 'SCORE';
