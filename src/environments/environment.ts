// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    apiUrl: 'undefined',
   CRYPTO_KEY: '0123456789ABCDEF',
   production: true,
   servBiometrico: 'http://localhost:9763/sobio-client/rest/client/',
   TIEMPO_ESCANEO: 10,
   wsEndpoint: 'ws://localhost:9763/sobio-client/websocket',
   TIEMPO_ALERTA_CS: 2,
   TIEMPO_MAX_RECINTO_CS: 10,
   deviceServicesREST: 'http://localhost:3601',
   deviceServicesWS: 'ws://localhost:3601/ws'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
