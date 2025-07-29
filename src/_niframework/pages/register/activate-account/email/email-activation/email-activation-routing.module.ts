import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailActivationPage } from './email-activation.page';

const routes: Routes = [
  {
    path: '',
    component: EmailActivationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailActivationPageRoutingModule {}
