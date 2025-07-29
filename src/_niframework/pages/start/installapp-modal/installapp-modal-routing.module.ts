import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstallappModalPage } from './installapp-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InstallappModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallappModalPageRoutingModule {}
