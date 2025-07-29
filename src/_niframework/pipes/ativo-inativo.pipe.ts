import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ativoInativo'
})
export class AtivoInativoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value === true? "Ativo" : "Inativo";
  }

}


// Troca valores true e false para ativo ou inativo