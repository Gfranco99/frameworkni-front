import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmailActivationPageRoutingModule } from './email-activation-routing.module';

import { EmailActivationPage } from './email-activation.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailActivationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmailActivationPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class EmailActivationPageModule {}
