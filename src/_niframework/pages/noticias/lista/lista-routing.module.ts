import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPage } from './lista.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPage
  },
  {
    path: 'detalhes/:id',
    loadChildren: () => import('../detalhes/detalhes.module').then(m => m.DetalhesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPageRoutingModule {}
