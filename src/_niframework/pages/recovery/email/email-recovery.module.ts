import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailPageRoutingModule } from './email-recovery-routing.module';

import { EmailRecoveryPage } from './email-recovery.page';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';

// import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [EmailRecoveryPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EmailPageModule {}
