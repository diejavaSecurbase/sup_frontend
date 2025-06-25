import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { XFSMessage } from './interfaces/XFSMessage';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService2 {

  private static TOPIC_FINGER_SCANNER = '/topic/finger-scanner';
  
  stompClient: any;
  private connected = false;

  callback: Function = null;

  fingerScannerEvent : Observable<XFSMessage>;
  private fingerScannerObserver : Observer<XFSMessage>;

  constructor() {
    this.fingerScannerEvent = Observable.create(
      observer => {
        this.fingerScannerObserver = observer;
      }
    );
    this._connect(environment.deviceServicesWS); //URL del websocket del servicio 
  }

  private _connect(url) {
    console.log('Initialize WebSocket Connection');
    this.stompClient = Stomp.client(url);
    this.stompClient.debug = null;
    this.stompClient.connect({}, (frame) => {
        this.connected = true;
        this.stompClient.subscribe(WebsocketService2.TOPIC_FINGER_SCANNER, (wsEvent) => {
          if (!isNullOrUndefined(wsEvent) && !isNullOrUndefined(wsEvent.body)) {
            try {
              // console.log('Event FINGER SCANNER: '+wsEvent.body);
              //console.log('Event FINGER SCANNER: ...');
              if (!isNullOrUndefined(this.fingerScannerObserver) && !isNullOrUndefined(this.fingerScannerObserver.closed) && this.fingerScannerObserver.closed == false) {
                // console.log('Event CASH TAKEN dispatched');
                this.fingerScannerObserver.next(JSON.parse(wsEvent.body));
                // this.cashDispenseObserver.complete();
              }
            } catch (t) {
              console.error(t);
            }
          }
        });
    }, (error) => {
      this.connected = false;
      console.log('errorCallBack -> ' + error);
      if (environment.production) {
        setTimeout(() => {
          console.log('reconecting to ws...');
          this._connect(environment.deviceServicesWS);
        }, 1000);  
      }
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
        this.connected = false;
    }
    console.log('Disconnected');
  }
}
