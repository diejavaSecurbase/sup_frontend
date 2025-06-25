import { DatosBajaCliente } from "../DTO/DatosBajaCliente";

export const mockDatosBajaCliente: DatosBajaCliente = {
  dbid: '80:4:12345678',
  sucursal: 100,
  fecha_enrolamiento: new Date('2023-10-23T10:48:08.900Z'),
  fecha_ult_actualizacion: new Date('2023-11-23T10:48:08.900Z'),
  fecha_ult_identificacion: new Date('2023-11-23T10:48:08.900Z'),
  fecha_ult_verificacion: null,
  dbid_duplicado: null,
  nro_gestar: '987654',
  fecha_baja: new Date('2024-03-01'),
  usuario: 'admin_baja',
  usuario_enr: 'admin_enrolamiento',
  usuario_act: 'admin_actualizacion',
  id_persona: 1111,
  motivo_baja: 'Fallecimiento',
  highlighted: [],
  posicionLista: 0
};
