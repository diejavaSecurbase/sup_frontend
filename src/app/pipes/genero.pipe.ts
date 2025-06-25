import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genero'
})
export class GeneroPipe implements PipeTransform {

  transform(value: string): unknown {
    if (value === 'F') {
      return 'Femenino';
    } else if (value === 'M') {
      return 'Masculino';
    }
    else {
      return value;
    }
  }

}
