import { Menu } from './Menu';

describe('Menu', () => {

  it('Deberia crearse una instancia', () => {
    expect(new Menu()).toBeTruthy();
  });

  it('clone()', ()=>{
      let menu = new Menu();
      menu.id = '1';
      menu.descripcion = 'test';
      menu.orden = 1;
      menu.padre = 'home';
      
      let menu2 = menu.clone(menu);

      expect(menu2).toEqual(menu);
      })
});
