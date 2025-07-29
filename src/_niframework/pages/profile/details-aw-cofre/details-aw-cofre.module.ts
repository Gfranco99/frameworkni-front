import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsAwCofrePageRoutingModule } from './details-aw-cofre-routing.module';

import { DetailsAwCofrePage } from './details-aw-cofre.page';
import { PipesSharedModule } from 'src/_niframework/pipes/pipes-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsAwCofrePageRoutingModule,
    PipesSharedModule
  ],
  declarations: [DetailsAwCofrePage]
})
export class DetailsAwCofrePageModule {}
