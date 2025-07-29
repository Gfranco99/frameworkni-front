import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsAwCofrePage } from './details-aw-cofre.page';
import { AuthGuard } from 'src/_niframework/providers/authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DetailsAwCofrePage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsAwCofrePageRoutingModule {}
