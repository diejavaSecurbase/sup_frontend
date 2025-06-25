export class Menu {

  id: string;
  descripcion: string;
  orden: number;
  padre: string;

  hasSubmenues?: boolean;
  children?: Menu[];

  clone(r: Menu) {
    const row = new Menu();
    row.id = r.id;
    row.descripcion = r.descripcion;
    row.padre = r.padre;
    row.orden = r.orden;
    return row;
}
}
