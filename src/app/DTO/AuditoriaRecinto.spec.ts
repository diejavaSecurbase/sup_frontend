import { compileNgModule } from '@angular/compiler';
import { AuditoriaRecinto } from './AuditoriaRecinto';

describe('AuditoriaRecinto', () => {
  it('Deberia crearse una instancia', () => {
    expect(new AuditoriaRecinto()).toBeTruthy();
  });

  it('clone()', ()=>{
      let audrec = new AuditoriaRecinto();
      audrec.nombreApellido = 'Carlos';
      audrec.sucursal = 'Tandil';
      audrec.tipoIdent = 'dni';
      audrec.nroCaja = '1';
      audrec.cuenta = '1';
      audrec.tipoAcceso = '1';
      audrec.accion = '1';
      audrec.tiempo = 1;
      let audrec2 = audrec.clone(audrec);

      expect(audrec2).toEqual(audrec);
      })
});
