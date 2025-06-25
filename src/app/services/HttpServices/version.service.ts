import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class VersionService {

  constructor( public http: HttpClient, public login: LoginService ) { }

  getVersion(): Observable<string>{
    return this.http.get('../../VERSION',
    {
      responseType: 'text'
    });
  }
}
