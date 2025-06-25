import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScanFingerprintOutput } from '../../DTO/ScanFingerprintOutput';
import { XfsOutputData } from '../../DTO/XfsOutputData';
import { isNullOrUndefined } from 'util';
import { xfsApiUtils, XfsApiCallId } from './xfs-api-utils';
import { ErrorService } from '../error.service';
import { Error } from '../../DTO/error';

@Injectable({
  providedIn: 'root'
})
export class XfsApiService {

  private static ENDPOINTS = {
    scanFingerprint: environment.deviceServicesREST + '/v1/local-devices/scan-fingerprint',
    cancelScanFingerprint: environment.deviceServicesREST + '/v1/local-devices/cancel-scan-fingerprint',
    scanFingerprintEncrypted: environment.deviceServicesREST + '/v1/local-devices/scan-fingerprint-encrypted',
    checkScanFingerPrintVersion: environment.deviceServicesREST + '/v1/local-devices/check-scan-fingerprint-version',
  };

  constructor(
    private http: HttpClient,
    private errorService: ErrorService) { 
  }

  public scanFingerprint(deviceFilter: string, wsqRateCompression: number, timeout: number): Observable<ScanFingerprintOutput> {
    const data = {
      auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.scanFingerprint),
      deviceFilter: deviceFilter,
      timeout: timeout,
      maxRetry: 0,
      sendPreview: false,
      wsqCompression: wsqRateCompression
    };
    return this.http.post<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.scanFingerprint, data);
  }

  public scanFingerprintWithPreview(deviceFilter: string, wsqRateCompression: number, maxRetry: number, timeout: number): Observable<ScanFingerprintOutput> {
    const data = {
      auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.scanFingerprint),
     // deviceFilter: deviceFilter,
      timeout: timeout,
      maxRetry: maxRetry,
      sendPreview: true,
      wsqCompression: wsqRateCompression
    };
    return this.http.post<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.scanFingerprint, data, {responseType: 'json'});
  }

  public cancelScanFingerprint(): Observable<XfsOutputData> {
    const data = {
      auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.cancelScanFingerprint),
    };
    return this.http.post<XfsOutputData>(XfsApiService.ENDPOINTS.cancelScanFingerprint, data);
  }


  public scanFingerprintEncrypted(deviceFilter: string, wsqRateCompression: number, timeout: number, key: string): Observable<ScanFingerprintOutput> {
    const data = {
      auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.scanFingerprint),
      deviceFilter: deviceFilter,
      timeout: timeout,
      maxRetry: 0,
      sendPreview: false,
      wsqCompression: wsqRateCompression,
      publicKey: key
    };
    return this.http.post<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.scanFingerprintEncrypted, data);
  }

  public scanFingerprintEncryptedWithPreview(deviceFilter: string, wsqRateCompression: number, maxRetry: number, timeout: number, key: string): Observable<ScanFingerprintOutput> {
    const data = {
      auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.scanFingerprint),
     // deviceFilter: deviceFilter,
      timeout: timeout,
      maxRetry: maxRetry,
      sendPreview: true,
      wsqCompression: wsqRateCompression,
      publicKey: key
    };
    sessionStorage.setItem('encryptionWorking', 'true');
    return this.http.post<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.scanFingerprintEncrypted, data, {responseType: 'json'})
    .pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        //this.errorService.setError(new Error('Información de Escaner', 'Portal de Clientes', 'Drivers de huella sin actualizar, se utilizaran los anteriores', '0'));
        const data = {
          auditToken: xfsApiUtils.buildAuditToken(XfsApiCallId.scanFingerprint),
         // deviceFilter: deviceFilter,
          timeout: timeout,
          maxRetry: maxRetry,
          sendPreview: true,
          wsqCompression: wsqRateCompression
        };
        sessionStorage.setItem('encryptionWorking', 'false');
        return this.http.post<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.scanFingerprint, data, {responseType: 'json'});
      })
    );;
  }

  public checkScanFingerPrintVersion(): Observable<ScanFingerprintOutput> {    
    return this.http.get<ScanFingerprintOutput>(XfsApiService.ENDPOINTS.checkScanFingerPrintVersion, {responseType: 'json'})
  }

}
