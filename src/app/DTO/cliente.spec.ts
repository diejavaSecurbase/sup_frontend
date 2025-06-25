import { Cliente } from './cliente';

describe('Cliente', () => {
  it('Deberia crearse una instancia', () => {
    expect(new Cliente()).toBeTruthy();
  });
});
