import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Notfound404Page } from './notfound404.page';

const routes: Routes = [
  {
    path: '',
    component: Notfound404Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Notfound404PageRoutingModule {}
