import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsActivationPage } from './sms-activation.page';

const routes: Routes = [
  {
    path: '',
    component: SmsActivationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsActivationPageRoutingModule {}
