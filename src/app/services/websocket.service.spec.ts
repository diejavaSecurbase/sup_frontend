import { componentFactoryName } from '@angular/compiler';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EMPTY, isObservable, of, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        //Imports de todos los servicios y modulos que usa el componente y que tambien usan las dependencias del componente
    });
      service = TestBed.inject(WebsocketService);
  });

    it('should be created', () => {
        // jasmine.clock().install();
        // //Se crea una instancia para que se ejecute el constructor
        // service = new WebsocketService();
        // let spyconnect = spyOn(service, 'connect').and.callThrough();
        // tick(5001);
        // expect(spyconnect).toHaveBeenCalled();
        expect(service).toBeTruthy();
        // jasmine.clock().uninstall();
  });
    
    it('connect()', () => {
        service.connect('ws://www.google.com');
    })

    xit('send()', () => {
        service.send('ws://google.com');
    })

    it('reset()', () => {
        service.reset();
    })

    it('getWS()', () => {
        service.getWS();
    })

    it('getImagenHuella()', () => {
        service.getImagenHuella();
    })
});
