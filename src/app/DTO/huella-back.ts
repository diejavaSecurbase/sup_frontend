import { Huella } from './Huella';

export class HuellaBack {
  dedo: string;
  estado_huella: string;
  imagen: string;
  nfiq: string;
  origen: string;
  template: string;

  constructor( huella: Huella, origen: string, dedo: string, status: string){
    this.origen = origen;
    this.dedo = dedo;
    this.estado_huella = status;
    this.imagen = huella.wsqBase64;
    this.template = huella.templateBase64;
    this.nfiq = huella.nfiq;
  }
}
