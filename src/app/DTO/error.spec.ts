import { Error } from './error';

describe('Error', () => {
  it('Deberia crearse una instancia', () => {
    expect(new Error('Error Test','Unit Test', 'Testing', '1')).toBeTruthy();
  });
});
