import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { Error } from '../DTO/error';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  public error: Error = null;
  constructor(  private errorService: ErrorService ) {}

  ngOnInit(): void {
    this.errorService.getError().subscribe(mensaje => {
      this.error = mensaje;
    });
  }

  cerrarError(){
    this.errorService.setError(null);
  }
}
