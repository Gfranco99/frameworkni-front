import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrMaskerModule } from 'br-mask';

import { IonicModule } from '@ionic/angular';

import { SecurityCheckPageRoutingModule } from './security-check-routing.module';

import { SecurityCheckPage } from './security-check.page';
import { BrMaskerModule } from 'src/_niframework/directives/brMasker/br-mask.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SecurityCheckPageRoutingModule,
    BrMaskerModule
  ],
  declarations: [SecurityCheckPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SecurityCheckPageModule {}
