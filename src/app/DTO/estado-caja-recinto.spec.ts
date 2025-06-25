import { EstadoCajaRecinto } from './estado-caja-recinto';

describe('EstadoCajaRecinto', () => {
  it('Deberia crearse una instancia', () => {
    expect(new EstadoCajaRecinto()).toBeTruthy();
  });

  it('clone()', ()=>{
    let ecr1 = new EstadoCajaRecinto();
    ecr1.cliente = 'Carlos';
    ecr1.apellidoNombre = 'Tester';
    ecr1.identificacion =  '1';
    ecr1.cajas = '1';
    ecr1.horaIngreso = 8;
    let ecr2 = ecr1.clone(ecr1);

    expect(ecr2).toEqual(ecr1);
  });
});
