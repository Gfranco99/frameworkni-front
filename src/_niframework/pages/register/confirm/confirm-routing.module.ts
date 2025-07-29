import { LoginPage } from './../../login/login.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmPage } from './confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPage
  },
  {
    path: 'login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmPageRoutingModule {}
