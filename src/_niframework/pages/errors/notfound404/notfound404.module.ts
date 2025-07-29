import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Notfound404PageRoutingModule } from './notfound404-routing.module';

import { Notfound404Page } from './notfound404.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Notfound404PageRoutingModule
  ],
  declarations: [Notfound404Page]
})
export class Notfound404PageModule {}
