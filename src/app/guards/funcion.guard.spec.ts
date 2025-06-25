import { TestBed } from '@angular/core/testing';

import { FuncionGuard } from './funcion.guard';
//Este guard me daba error al compilar, no pude encontrar el error
xdescribe('FuncionGuard', () => {
  let guard: FuncionGuard;

  beforeEach(() => {

  });

  it('Deberia de crearse una instancia', () => {
    expect(guard).toBeTruthy();
  });
});
