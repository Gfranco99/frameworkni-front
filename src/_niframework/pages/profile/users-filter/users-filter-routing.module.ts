import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersFilterPage } from './users-filter.page';

const routes: Routes = [
  {
    path: '',
    component: UsersFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersFilterPageRoutingModule {}
