import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerPreviewComponent } from './finger-preview.component';
import { XFSMessageTypeEnum } from '../services/huella/interfaces/XFSMessageTypeEnum';
import { XFSMessage } from '../services/huella/interfaces/XFSMessage';
import { IndicationEnum } from './IndicationEnum';
import { XFSValueFormatEnum } from '../services/huella/interfaces/XFSValueFormatEnum';

describe('FingerPreviewComponent', () => {
  let component: FingerPreviewComponent;
  let fixture: ComponentFixture<FingerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set state to ready and indicate pressing harder when PRESS_FINGER_HARDER is received', () => {
    const msgEvent: XFSMessage = {
      type: XFSMessageTypeEnum.INDICATION, value: IndicationEnum.PRESS_FINGER_HARDER,
      format: XFSValueFormatEnum.TEXT
    };
    component.updateState(msgEvent);
    expect(component.state).toBe('ready');
    expect(component.indicacionPrincipal).toBe('Presione con mas fuerza');
  });
  it('should set state to scan-ok and indicate processing when FINGER_ACQUISITION_OK is received', () => {
    const msgEvent: XFSMessage = {
      type: XFSMessageTypeEnum.INDICATION, value: IndicationEnum.FINGER_ACQUISITION_OK,
      format: XFSValueFormatEnum.TEXT
    };
    component.updateState(msgEvent);
    expect(component.state).toBe('scan-ok');
    expect(component.indicacionPrincipal).toBe('Procesando la huella capturada');
  });
  it('should set readyFingerImg when PREVIEW message is received', () => {
    const base64Image = 'someBase64String';
    const msgEvent: XFSMessage = {
      type: XFSMessageTypeEnum.PREVIEW, value: base64Image,
      format: XFSValueFormatEnum.TEXT
    };
    component.updateState(msgEvent);
    expect(component.state).toBe('ready');
    expect(component.readyFingerImg).toBe('data:image/png;base64,' + base64Image);
  });
  it('should hide empty finger when message value is not NO_FINGER', () => {
    const msgEvent: XFSMessage = {
      type: XFSMessageTypeEnum.INDICATION, value: IndicationEnum.FINGER_DETECTED,
      format: XFSValueFormatEnum.TEXT
    };
    component.updateState(msgEvent);
    expect(component.hideEmptyFinger).toBeTrue();
  });
});
