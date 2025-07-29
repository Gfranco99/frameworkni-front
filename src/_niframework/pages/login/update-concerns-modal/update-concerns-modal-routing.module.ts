import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateConcernsModalPage } from './update-concerns-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateConcernsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateConcernsModalPageRoutingModule {}
