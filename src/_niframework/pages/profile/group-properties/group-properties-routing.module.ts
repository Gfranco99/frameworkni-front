import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPropertiesPage } from './group-properties.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPropertiesPageRoutingModule {}
