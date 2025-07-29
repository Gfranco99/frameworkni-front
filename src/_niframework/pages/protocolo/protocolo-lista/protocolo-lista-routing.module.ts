import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocoloListaPage } from './protocolo-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocoloListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocoloListaPageRoutingModule {}
