export const environment = {
  production: true,
  //backend: 'http://bff-portal-clientes.k8sds.gscorp.ad',
  apiUrl: window["env"]["apiUrl"] || "default",
  CRYPTO_KEY: '0123456789ABCDEF',
  servBiometrico: 'http://localhost:9763/sobio-client/rest/client/',
  TIEMPO_ESCANEO: 10,
  wsEndpoint: 'ws://localhost:9763/sobio-client/websocket',
  deviceServicesREST: 'http://localhost:3601',
  deviceServicesWS: 'ws://localhost:3601/ws'
};
