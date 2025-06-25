import { Injectable, EventEmitter } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { catchError, tap, switchAll, timeout } from 'rxjs/operators';
import { EMPTY, Subject, Observable, Observer, BehaviorSubject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private ws: any;
  imagenHuella1: BehaviorSubject<string> = new BehaviorSubject(null);
  public onConnect: EventEmitter<void> = new EventEmitter<void>();
  private avoidNext: boolean;
  private suscripcion = null;
  constructor() {
    this.verificarConexion();
  }
  
  private start(){
    this.avoidNext = false;
    this.suscripcion = this.connect(environment.wsEndpoint).subscribe(data => {
      const estadoMovNull = JSON.parse(data.data).estadoMovimiento == null;
      if(estadoMovNull || this.avoidNext){
        this.avoidNext = estadoMovNull;
      }else{
        this.imagenHuella1.next(`data:image/png;base64,${JSON.parse(data.data).wsqPng}`);
      }
    }, err => {
    });
  
    this.onConnect.subscribe(datos => {
      this.getWS().send('ping');
    });
  }

  
  private subject: Subject<MessageEvent>;

  public connect(url): Subject<MessageEvent> {
    if (!this.subject || !this.subject.closed) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url): Subject<MessageEvent> {
    this.ws = new WebSocket(url);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose =obs.error.bind(obs);
      this.ws.onopen = () => {
        this.onConnect.emit();
      };
      return this.ws.close.bind(this.ws);
    });
    
    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

  private verificarConexion(){
    setInterval(()=>{
      if (!this.suscripcion || this.suscripcion.closed || this.suscripcion.isStopped) {
        this.start();
      }
    },5000)
  }

  public send(msg: string) {
    this.ws.next(msg);
}

  public reset() {
    this.imagenHuella1.next("");
  }

  public getWS() {
    return this.ws;
  }

  public getImagenHuella(): Observable<string>{
    return this.imagenHuella1;
  }
}
