import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailRecoveryPage } from './email-recovery.page';

const routes: Routes = [
  {
    path: '',
    component: EmailRecoveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailPageRoutingModule {}
