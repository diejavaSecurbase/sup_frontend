import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from '../services/loader.service';
//import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';

// Agregar las rutas que no necesiten spinner
const NO_SPINNER = [
    'http://localhost:3601'
];

const NO_SPINNER2 = [
    'http://localhost:9763'
];

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    requestCount = 0;

    constructor(public loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requiereSpinner1 = NO_SPINNER.some(x => !req.url.includes(x));
        let requireSpinner2 = NO_SPINNER2.some(x => !req.url.includes(x));
        let requiereSpinner = true; 
        if(!requiereSpinner1 || !requireSpinner2){
            requiereSpinner = false
        }
        if (requiereSpinner) {
            this.loaderService.show();
            this.requestCount++;
            return next.handle(req).pipe(
                finalize(() => {
                    this.requestCount--;
                    if (this.requestCount <= 0) {
                        this.loaderService.hide();
                    }
                })
            )
        }
        return next.handle(req);
    }
}