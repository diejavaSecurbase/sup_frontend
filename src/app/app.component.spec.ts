import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {} from 'jasmine';
describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(()=>{
    component = new AppComponent(null, null);
  });

  it('Variable title debe ser igual a spa-portal-clientes', ()=>{
    expect(component.title).toEqual('spa-portal-clientes');
  })
});
