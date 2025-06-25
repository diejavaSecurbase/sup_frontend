/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebsocketService2 } from './websocket2.service';

describe('Service: Websocket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketService2]
    });
  });

  it('should ...', inject([WebsocketService2], (service: WebsocketService2) => {
    expect(service).toBeTruthy();
  }));
});
