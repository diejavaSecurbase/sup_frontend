export class DatosBajaCliente {
    dbid: string;
    sucursal: number;
    fecha_enrolamiento: Date;
    fecha_ult_actualizacion: Date;
    fecha_ult_identificacion: Date;
    fecha_ult_verificacion: Date;
    dbid_duplicado: string;
    nro_gestar: string;
    fecha_baja: Date;
    usuario: string;
    usuario_enr: string;
    usuario_act: string;
    id_persona: number;
    motivo_baja: string;
    highlighted: ColumnFilterNames[];
    posicionLista: number;
}

type ColumnFilterNames = 'DBID' | 'SUCURSAL' | 'FECHA_ULT_ACT' | 'FECHA_ENR' | 'FECHA_ULT_IDEN' | 'FECHA_ULT_VER' | 'DBID_DUPLICADO' |
                         'NRO_GESTAR' | 'FECHA_BAJA' | 'USUARIO' | 'USUARIO_ENR' | 'USUARIO_ACT' | 'ID_PERSONA' | 'MOTIVO_BAJA';
