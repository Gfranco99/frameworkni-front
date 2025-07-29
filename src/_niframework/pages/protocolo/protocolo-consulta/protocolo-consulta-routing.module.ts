import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocoloConsultaPage } from './protocolo-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocoloConsultaPage
  },
  {
    path: ':id/:pass/:type/:add',
    loadChildren: () => import('../protocolo-detail/protocolo-detail.module').then(m => m.ProtocoloDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocoloConsultaPageRoutingModule {}
