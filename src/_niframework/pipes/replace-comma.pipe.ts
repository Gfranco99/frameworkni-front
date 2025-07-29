import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceComma',
})
export class ReplaceCommaPipe implements PipeTransform {
  transform(obj: any): any {
    const values = obj.join(' / ');

    return values;
  }
}

// substitui virgulas por algum outro sinal dentro do join
