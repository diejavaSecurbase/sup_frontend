import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToEspacio'
})
export class CamelCaseToEspacioPipe implements PipeTransform {

  transform(value: string): string {
    if(value.trim().includes(' ')){
      return value;
    }
    let margen = 0;
    let transform: string = value;
    for(let x = 0; x < value.length; x++){
      if(value[x].toUpperCase() === value[x] && value[x].toLowerCase() !== value[x]){
        if( x > 0 && x < value.length &&
            value[x-1].toLowerCase() === value[x-1] && value[x-1].toUpperCase() !== value[x-1] &&
            value[x+1].toLowerCase() === value[x+1] && value[x+1].toUpperCase() !== value[x+1]
          ){
            let caracter = transform[x + margen].toLowerCase();
            const principio = transform.substring(0, x + margen);
            const final = transform.substring(x + margen + 1);
            transform = principio.concat(' ', caracter, final);
            margen++;
          }
      }
    }
    return transform;
  }

}
