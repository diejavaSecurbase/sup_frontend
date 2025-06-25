import { Component, Input, OnInit } from '@angular/core';
import { XFSMessage } from 'src/app/services/huella/interfaces/XFSMessage';
import { XFSMessageTypeEnum } from '../services/huella/interfaces/XFSMessageTypeEnum';
import { isNullOrUndefined } from 'util';
import { IndicationEnum } from './IndicationEnum';

@Component({
  selector: 'finger-preview',
  templateUrl: './finger-preview.component.html',
  styleUrls: ['./finger-preview.component.scss']
})
export class FingerPreviewComponent implements OnInit {

  @Input()
  public initialFingerImg : string = undefined;
  @Input()
  public emptyFingerImg : string = undefined;

  public readyFingerImg : string = undefined;

  @Input()
  public moveFingerUpImg : string = undefined;
  @Input()
  public moveFingerDownImg : string = undefined;
  @Input()
  public moveFingerLeftImg : string = undefined;
  @Input()
  public moveFingerRightImg : string = undefined;

  moveFinger : string;
  indicacionPrincipal : string;
  indicacionSecundaria : string;

  hideEmptyFinger : boolean;

  //init, empty, ready, scan-ok
  state : string;

  private idTimerInterval : any;
  private msgEventQueued : XFSMessage = null;
  private msgEventShowed : XFSMessage = null;

  constructor() { 
  }

  ngOnInit() {
    this.init();
  }

  public init() {
    clearInterval(this.idTimerInterval);
    this.state = 'init';
    this.moveFinger = null;
    this.msgEventQueued = null;
    this.msgEventShowed = null; 

    this.readyFingerImg = undefined;

    this.indicacionPrincipal = 'Apoye su dedo en el lector de huellas';
    this.indicacionSecundaria = null;

    this.hideEmptyFinger = false;
    
    this.idTimerInterval = setInterval(() => {
      if (!isNullOrUndefined(this.msgEventQueued)) {
        let msg = this.msgEventQueued;
        this.msgEventQueued = null;
        this.updateState(msg)
      }      
    }, 500);
    setTimeout(() => {
      this.hideEmptyFinger = true;
    }, 2000);
  }

  public queueState(msgEvent : XFSMessage) {
    console.log(msgEvent); 
    if (this.msgEventShowed == null) {
      this.updateState(msgEvent);
    } else {
      this.msgEventQueued = msgEvent;
    }
  }

  public updateState(msgEvent : XFSMessage) {
    if (msgEvent.type == XFSMessageTypeEnum.INDICATION) { 
      this.moveFinger = null;
      this.indicacionSecundaria = null;
      if (msgEvent.value != IndicationEnum.NO_FINGER) {
        this.hideEmptyFinger = true;
      }
      if (this.state != 'scan-ok') {
        // if (msgEvent.value == IndicationEnum.NO_FINGER) {
        //   // this.hideEmptyFinger = false;
        //   this.state = 'empty';
        //   this.indicacionPrincipal = 'Apoye su pulgar o índice en el lector de huellas';
        // } else 
        if (msgEvent.value == IndicationEnum.PRESS_FINGER_HARDER) {
          this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Presione con mas fuerza';
        } else if (msgEvent.value == IndicationEnum.LATENT_FINGER_DETECTED) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mantenga el dedo quieto';
        } else if (msgEvent.value == IndicationEnum.REMOVE_FINGER) {
          // this.hideEmptyFinger = false;
          this.state = 'ready';
          this.indicacionPrincipal = 'Levante el dedo del lector';
        } else if (msgEvent.value == IndicationEnum.FINGER_DETECTED) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mantenga el dedo en el lector';
        } else if (msgEvent.value == IndicationEnum.FINGER_MISPLACED) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Ubique su dedo lo mas centrado posible en el lector';
        } else if (msgEvent.value == IndicationEnum.FINGER_ACQUISITION_OK || msgEvent.value == IndicationEnum.FINGERPRINT_ACQUISITION_OK) {
          // this.hideEmptyFinger = true;
          this.state = 'scan-ok';
          this.indicacionPrincipal = 'Procesando la huella capturada';
  
        } else if (msgEvent.value == IndicationEnum.MOVE_FINGER_UP) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mueva el dedo hacia arriba';
          this.moveFinger = 'up';
        } else if (msgEvent.value == IndicationEnum.MOVE_FINGER_DOWN) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mueva el dedo hacia abajo';
          this.moveFinger = 'down';
        } else if (msgEvent.value == IndicationEnum.MOVE_FINGER_LEFT) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mueva el dedo hacia la izquierda';
          this.moveFinger = 'left';
        } else if (msgEvent.value == IndicationEnum.MOVE_FINGER_RIGHT) {
          // this.hideEmptyFinger = true;
          this.state = 'ready';
          this.indicacionPrincipal = 'Mueva el dedo hacia la derecha';
          this.moveFinger = 'right';
        }
        this.msgEventShowed = msgEvent;
      }
    } else if (msgEvent.type == XFSMessageTypeEnum.PREVIEW) {
      this.state = 'ready';
      this.readyFingerImg = 'data:image/png;base64,'+msgEvent.value;
      // this.moveFinger = null;  
    }
  }

}
