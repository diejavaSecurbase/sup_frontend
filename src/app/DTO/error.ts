export class Error {
    titulo: string;
    origen: string;
    detalle: string;
    codigo: string;

    constructor(titulo: string, origen: string, detalle: string, codigo: string){
        this.titulo = titulo;
        this.origen = origen;
        this.detalle = detalle;
        this.codigo = codigo;
    }
}
