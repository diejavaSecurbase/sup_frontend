import { ErrorResponse } from './error-response';

describe('ErrorResponse', () => {
  it('Deberia crearse una instancia', () => {
    expect(new ErrorResponse()).toBeTruthy();
  });
});
