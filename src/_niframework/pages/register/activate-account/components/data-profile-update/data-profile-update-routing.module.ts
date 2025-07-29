import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataProfileUpdatePage } from './data-profile-update.page';

const routes: Routes = [
  {
    path: '',
    component: DataProfileUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProfileUpdatePageRoutingModule {}
