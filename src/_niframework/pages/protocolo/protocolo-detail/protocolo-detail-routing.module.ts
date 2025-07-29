import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocoloDetailPage } from './protocolo-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocoloDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocoloDetailPageRoutingModule {}
