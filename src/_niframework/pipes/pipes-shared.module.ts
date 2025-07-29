import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtivoInativoPipe } from './ativo-inativo.pipe';
import { CpfCnpjPipe } from './cpf-cnpj.pipe';
import { ReplaceCommaPipe } from './replace-comma.pipe';

@NgModule({
  declarations: [AtivoInativoPipe, CpfCnpjPipe, ReplaceCommaPipe],

  imports: [CommonModule],

  exports: [AtivoInativoPipe, CpfCnpjPipe, ReplaceCommaPipe],
})
export class PipesSharedModule {}

/*

  Módulo para ser importado nos demais componentes para uso dos pipes

*/
