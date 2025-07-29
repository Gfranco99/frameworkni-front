import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryPageRoutingModule } from './recovery-routing.module';

import { RecoveryPage } from './recovery.page';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoveryPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [RecoveryPage]
})
export class RecoveryPageModule {}
