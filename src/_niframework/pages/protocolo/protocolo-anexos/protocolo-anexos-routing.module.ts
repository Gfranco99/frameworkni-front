import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocoloAnexosPage } from './protocolo-anexos.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocoloAnexosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocoloAnexosPageRoutingModule {}
