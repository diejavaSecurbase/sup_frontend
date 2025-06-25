import { NavUser } from './nav-user';

describe('NavUser', () => {
  it('Deberia crearse una instancia', () => {
    expect(new NavUser('testing','testing')).toBeTruthy();
  });
});
