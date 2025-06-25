import { Huella } from './Huella';
import { HuellaBack } from './huella-back';
import {} from './Huella';
describe('HuellaBack', () => {
  it('Deberia crearse una instancia', () => {
    expect(new HuellaBack(new Huella(), 'testing', 'pulgar izquierdo', 'OK')).toBeTruthy();
  });
});
