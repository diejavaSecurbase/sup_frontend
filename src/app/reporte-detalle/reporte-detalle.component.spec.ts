import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDetalleComponent } from './reporte-detalle.component';

xdescribe('ReporteDetalleComponent', () => {
  let component: ReporteDetalleComponent;
  let fixture: ComponentFixture<ReporteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
// Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
      declarations: [ ReporteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
