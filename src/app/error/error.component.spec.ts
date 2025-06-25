import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';

import { ErrorComponent } from './error.component';
import { By } from '@angular/platform-browser';
import { EMPTY, empty, throwError } from 'rxjs';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
//Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ ErrorComponent ],
      providers: [ErrorService, MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    component = new ErrorComponent(new ErrorService(new MessageService()));
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse una instancia', () => {
    expect(component).toBeTruthy();
  });

  it('cerrarError()', ()=>{
    component.error  = new Error('test', 'test', 'test', 'test');
    fixture.detectChanges();

    let anchor = fixture.debugElement.query(By.css('.completo > .alert-box > a')).nativeElement;

    let errorServiceTest = TestBed.inject(ErrorService);
    let spysetError = spyOn(errorServiceTest, 'setError').and.callFake(() => {
      return EMPTY;
    });
    

    anchor.click();

    expect(spysetError).toHaveBeenCalled();
    
  })
});
